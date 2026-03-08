// services/fe/payment.service.js

const {
  sequelize,
  Order,
  OrderItem,
  TicketType,
  Event,
  Payment
} = require("../../../models");

const xendit = require("../../utils/xendit");
const { v4: uuid } = require("uuid");

module.exports = {
  async createInvoice(orderId) {

    const trx = await sequelize.transaction();

    try {

      const order = await Order.findByPk(orderId, {
        transaction: trx,
        lock: trx.LOCK.UPDATE
      });

      if (!order) throw new Error("Order not found");

      if (order.status !== "waiting_payment") {
        throw new Error("Order cannot be paid");
      }

      // prevent duplicate invoice
      const existing = await Payment.findOne({
        where: {
          order_id: orderId,
          status: "pending"
        },
        transaction: trx
      });

      if (existing) {

        await trx.commit();

        return existing;

      }

      // ===============================
      // LOAD ORDER ITEMS
      // ===============================

      const items = await OrderItem.findAll({
        where: { order_id: orderId },
        include: [
          {
            model: TicketType,
            as: "ticket_type",
            attributes: [
              "id",
              "name",
              "admin_fee_included",
              "tax_included"
            ]
          }
        ],
        transaction: trx
      });

      if (!items.length) {
        throw new Error("Order items not found");
      }

      // ===============================
      // LOAD EVENT
      // ===============================

      const event = await Event.findByPk(items[0].ticket_type.event_id);

      const mediaBase = process.env.MEDIA_URL_FRONTEND || "";

      const EVENT_INFO = {
        name: event?.name || "",
        logo: event?.image ? mediaBase + event.image : null,
        location: event?.location || "",
        province: event?.province || "",
        district: event?.district || "",
        date: event?.date_start || "",
        time: event?.time_start || "",
        timezone: event?.timezone || ""
      };

      const capitalize = (str) =>
        str
          ?.split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") || "";

      // ===============================
      // BUILD XENDIT ITEMS
      // ===============================

      let xenditItems = [];

      let totalAdminFeeBuyer = 0;
      let totalTaxBuyer = 0;

      for (const item of items) {

        const tt = item.ticket_type;

        xenditItems.push({
          name: capitalize(tt.name.toUpperCase()),
          quantity: item.quantity,
          price: Number(item.ticket_price),
          category: "ticket"
        });

        if (tt.admin_fee_included == 1) {
          totalAdminFeeBuyer += Number(item.admin_fee_amount);
        }

        if (tt.tax_included == 1) {
          totalTaxBuyer += Number(item.tax_amount);
        }

      }

      if (totalAdminFeeBuyer > 0) {

        xenditItems.push({
          name: "Biaya Layanan",
          quantity: 1,
          price: totalAdminFeeBuyer,
          category: "service_fee"
        });

      }

      if (totalTaxBuyer > 0) {

        xenditItems.push({
          name: "Pajak Daerah",
          quantity: 1,
          price: totalTaxBuyer,
          category: "tax"
        });

      }

      // ===============================
      // DESCRIPTION
      // ===============================

      const fullDescription = `
Pembayaran Tiket Event: ${EVENT_INFO.name}. Harga sudah termasuk biaya layanan & pajak daerah.
      `.trim();

      const expiryTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      // ===============================
      // CREATE XENDIT INVOICE
      // ===============================

      const invoice = await xendit.Invoice.createInvoice({

        data: {

          externalId: order.code_order,

          amount: Number(order.buyer_pay_total),

          currency: "IDR",

          description: fullDescription,

          items: xenditItems,

          customer: {

            givenNames: order.customer_name,
            email: order.customer_email,
            mobileNumber: order.customer_phone

          },

          successRedirectUrl: process.env.FRONTEND_SUCCESS_URL,

          failureRedirectUrl: process.env.FRONTEND_FAILED_URL,

          expiryDate: expiryTime

        }

      });

      // ===============================
      // SAVE PAYMENT
      // ===============================

      const payment = await Payment.create({

        id: uuid(),

        order_id: orderId,

        provider: "xendit",

        provider_transactions: invoice.id,

        amount: order.buyer_pay_total,

        status: "pending",

        payment_method: "INVOICE",

        invoice_url: invoice.invoiceUrl,

        raw_callback_log: JSON.stringify(invoice)

      }, { transaction: trx });

      await trx.commit();

      return payment;

    } catch (err) {

      await trx.rollback();

      throw err;

    }

  }

};