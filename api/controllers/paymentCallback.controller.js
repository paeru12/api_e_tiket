const { Order, Payment } = require("../../models");

module.exports = {
  async xenditCallback(req, res) {
    try {
      const token = req.headers["x-callback-token"];
      if (token !== process.env.XENDIT_CALLBACK_TOKEN)
        return res.status(401).json({ message: "Invalid callback token" });

      const body = req.body;
      const paymentId = body.external_id;
      const status = body.status;

      const payment = await Payment.findOne({
        where: { provider_transactions: body.id },
      });

      if (!payment) return res.status(404).json({ message: "Payment not found" });

      // update payment
      await payment.update({
        status: status === "PAID" ? "paid" : "failed",
        paid_at: status === "PAID" ? new Date() : null,
        raw_callback_log: JSON.stringify(body),
      });

      // update order
      const order = await Order.findByPk(payment.order_id);
      if (order) {
        await order.update({
          status: status === "PAID" ? "paid" : "canceled",
        });
      }

      res.json({ success: true });

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Callback error" });
    }
  },
};
