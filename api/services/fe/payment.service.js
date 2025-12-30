const { Order, Payment } = require("../../../models");
const x = require("../../utils/xendit");
const { v4: uuid } = require("uuid");

module.exports = {
  async createInvoice(orderId) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");

    // sudah ada pembayaran?
    let existing = await Payment.findOne({ where: { order_id: orderId } });
    if (existing && existing.status === "pending") {
      return existing;
    }

    const idempotencyKey = uuid();
    const invoiceClient = x.Invoice;

    const invoice = await invoiceClient.createInvoice({
      externalId: order.code_order,
      amount: Number(order.total_amount),
      description: `Pembayaran order ${order.code_order}`,
      currency: "IDR",
      customer: {
        given_names: order.customer_name,
        email: order.customer_email,
        mobile_number: order.customer_phone,
      },
      successRedirectUrl: process.env.FRONTEND_SUCCESS_URL,
      failureRedirectUrl: process.env.FRONTEND_FAILED_URL,
      paymentMethods: ["QRIS", "BCA", "BNI", "BRI", "MANDIRI", "PERMATA"],
      fees: [],
      idempotencyKey,
    });

    // simpan ke tabel payments
    const payment = await Payment.create({
      id: uuid(),
      order_id: orderId,
      provider: "xendit",
      provider_transactions: invoice.id,
      amount: order.total_amount,
      status: "pending",
      payment_method: invoice.available_banks ? "VA" : "QRIS",
      qris_image_url: invoice.qr_string
        ? `https://api.qrserver.com/v1/create-qr-code/?data=${invoice.qr_string}`
        : null,
      qris_payload: invoice.qr_string || null,
      qris_expired_at: invoice.expiry_date,
    });

    return {
      invoice_url: invoice.invoice_url,
      qr_string: invoice.qr_string || null,
      payment,
    };
  },
};
