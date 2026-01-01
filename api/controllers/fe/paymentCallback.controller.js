const {
  sequelize,
  Order,
  Payment,
  OrderItem,
  TicketType
} = require("../../../models");
const ticketService = require("../../services/fe/ticket.service");

module.exports = {
  async xenditCallback(req, res) {
    console.log("CALLBACK HEADERS:", req.headers);

    try {
      const token = req.headers["x-callback-token"];
      if (token !== process.env.XENDIT_CALLBACK_TOKEN) {
        return res.status(401).json({ message: "Invalid callback token" });
      }

      const { id, status } = req.body;

      // 🔹 STEP 1: Ambil payment TANPA transaction
      const payment = await Payment.findOne({
        where: { provider_transactions: id }
      });

      if (!payment) {
        // unknown payment → ACK supaya Xendit stop retry
        return res.json({ success: true });
      }

      // 🔹 STEP 2: IDEMPOTENCY CHECK
      if (payment.status === "paid") {
        return res.json({ success: true });
      }

      // 🔹 STEP 3: BARU buka transaction
      const trx = await sequelize.transaction();

      try {
        const lockedPayment = await Payment.findOne({
          where: { id: payment.id },
          transaction: trx,
          lock: trx.LOCK.UPDATE
        });

        // double check
        if (lockedPayment.status === "paid") {
          await trx.rollback();
          return res.json({ success: true });
        }

        const order = await Order.findByPk(lockedPayment.order_id, {
          transaction: trx,
          lock: trx.LOCK.UPDATE
        });

        const items = await OrderItem.findAll({
          where: { order_id: order.id },
          transaction: trx
        });

        if (status === "PAID") {
          for (const item of items) {
            const tt = await TicketType.findByPk(item.ticket_type_id, {
              transaction: trx,
              lock: trx.LOCK.UPDATE
            });

            tt.reserved_stock -= item.quantity;
            tt.ticket_sold += item.quantity;
            await tt.save({ transaction: trx });
          }

          await lockedPayment.update(
            { status: "paid", paid_at: new Date() },
            { transaction: trx }
          );

          await order.update(
            { status: "paid" },
            { transaction: trx }
          );

          await ticketService.generateTickets(order.id, trx);
        }

        await trx.commit();
        return res.json({ success: true });

      } catch (err) {
        await trx.rollback();
        throw err;
      }

    } catch (err) {
      console.error("XENDIT CALLBACK ERROR:", err);
      return res.status(200).json({ success: true });
      // ⚠️ tetap 200 supaya Xendit stop retry
    }
  }

};
