// controllers/fe/paymentCallback.controller.js

const {
  sequelize,
  Order,
  Event,
  Payment,
  OrderItem,
  TicketType,
  CreatorFinancials
} = require("../../../models");

const ticketService = require("../../services/fe/ticket.service");
const payoutService = require("../../services/dash/payout.service");

module.exports = {

  async xenditCallback(req, res) {


    try {

      const token = req.headers["x-callback-token"];

      if (token !== process.env.XENDIT_CALLBACK_TOKEN) {
        return res.status(401).json({ message: "Invalid callback token" });
      }

      const { id, status } = req.body;

      const payment = await Payment.findOne({
        where: { provider_transactions: id }
      });

      if (!payment) return res.json({ success: true });

      // idempotent callback
      if (payment.status === "paid") {
        return res.json({ success: true });
      }

      const trx = await sequelize.transaction();

      try {

        const lockedPayment = await Payment.findOne({
          where: { id: payment.id },
          transaction: trx,
          lock: trx.LOCK.UPDATE
        });

        const order = await Order.findByPk(
          lockedPayment.order_id,
          {
            transaction: trx,
            lock: trx.LOCK.UPDATE
          }
        );

        // =====================================
        // CASE 1: PAID
        // =====================================

        if (status === "PAID") {

          const items = await OrderItem.findAll({
            where: { order_id: order.id },
            transaction: trx
          });

          // ambil semua ticket type sekaligus
          const ticketTypeIds = items.map(i => i.ticket_type_id);

          const ticketTypes = await TicketType.findAll({
            where: { id: ticketTypeIds },
            transaction: trx,
            lock: trx.LOCK.UPDATE
          });

          const ticketTypeMap = {};
          ticketTypes.forEach(tt => {
            ticketTypeMap[tt.id] = tt;
          });

          const eventSoldMap = {};

          for (const item of items) {

            const tt = ticketTypeMap[item.ticket_type_id];
            if (!tt) continue;

            tt.reserved_stock -= item.quantity;
            tt.ticket_sold += item.quantity;

            eventSoldMap[tt.event_id] =
              (eventSoldMap[tt.event_id] || 0) + item.quantity;
          }

          // save semua ticket type
          await Promise.all(
            ticketTypes.map(tt =>
              tt.save({ transaction: trx })
            )
          );

          // update event ticket sold
          const eventUpdates = Object.entries(eventSoldMap)
            .map(([eventId, qty]) =>
              Event.increment(
                { total_ticket_sold: qty },
                {
                  where: { id: eventId },
                  transaction: trx
                }
              )
            );

          await Promise.all(eventUpdates);

          // update payment + order
          await Promise.all([
            lockedPayment.update(
              { status: "paid", paid_at: new Date() },
              { transaction: trx }
            ),
            order.update(
              { status: "paid" },
              { transaction: trx }
            )
          ]);

          // update creator financial
          let fin = await CreatorFinancials.findOne({
            where: { creator_id: order.creator_id },
            transaction: trx,
            lock: trx.LOCK.UPDATE
          });

          const orderIncome = Number(order.organizer_net_total || 0);

          if (!fin) {

            await CreatorFinancials.create({
              creator_id: order.creator_id,
              total_income: orderIncome,
              current_balance: orderIncome,
              total_payout: 0,
              pending_income: 0
            }, { transaction: trx });

          } else {

            fin.total_income =
              Number(fin.total_income) + orderIncome;

            fin.current_balance =
              Number(fin.current_balance) + orderIncome;

            await fin.save({ transaction: trx });

          }

          // generate ticket
          await ticketService.generateTickets(order.id, trx);

        }

        // =====================================
        // CASE 2: EXPIRED
        // =====================================

        if (status === "EXPIRED") {

          await payoutService.decreaseIncome(order.id, trx);

          await Promise.all([
            order.update(
              { status: "expired" },
              { transaction: trx }
            ),
            lockedPayment.update(
              { status: "expired" },
              { transaction: trx }
            )
          ]);

        }

        // =====================================
        // CASE 3: REFUND
        // =====================================

        if (status === "REFUNDED" || status === "REFUND") {

          await payoutService.decreaseIncome(order.id, trx);

          await Promise.all([
            order.update(
              { status: "refunded" },
              { transaction: trx }
            ),
            lockedPayment.update(
              { status: "refunded" },
              { transaction: trx }
            )
          ]);

        }

        await trx.commit();

        return res.json({ success: true });

      } catch (err) {

        await trx.rollback();

        return res.status(200).json({ success: true });

      }

    } catch (err) {

      return res.status(200).json({ success: true });

    }

  }

};