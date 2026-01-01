const { Order, Payment } = require("../../../models");
const xendit = require("../../utils/xendit");
const { v4: uuid } = require("uuid");

module.exports = {
  async createInvoice(orderId) {

    const order = await Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");

    if (order.status !== "waiting_payment") {
      throw new Error("Order not payable");
    }

    // anti double invoice
    const existing = await Payment.findOne({
      where: { order_id: orderId, status: "pending" },
    });

    if (existing) return existing;

    // 🔥 WAJIB pakai { data: {...} }
    const invoice = await xendit.Invoice.createInvoice({
      data: {
        externalId: order.code_order,
        amount: Number(order.total_amount),
        description: `Pembayaran ${order.code_order}`,
        currency: "IDR",

        customer: {
          givenNames: order.customer_name,
          email: order.customer_email,
          mobileNumber: order.customer_phone,
        },

        successRedirectUrl: process.env.FRONTEND_SUCCESS_URL,
        failureRedirectUrl: process.env.FRONTEND_FAILED_URL,
      },
    });

    return await Payment.create({
      id: uuid(),
      order_id: orderId,
      provider: "xendit",
      provider_transactions: invoice.id,
      amount: order.total_amount,
      status: "pending",
      payment_method: "INVOICE",
      invoice_url: invoice.invoiceUrl,
      raw_callback_log: JSON.stringify(invoice),
    });
  },
};
