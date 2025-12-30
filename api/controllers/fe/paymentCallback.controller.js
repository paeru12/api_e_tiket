const { Order, Payment } = require("../../../models");
const ticketService = require("../../services/fe/ticket.service");

module.exports = {
  async xenditCallback(req, res) {
    try {
      const token = req.headers["x-callback-token"];
      if (token !== process.env.XENDIT_CALLBACK_TOKEN)
        return res.status(401).json({ message: "Invalid callback token" });

      const body = req.body;
      const paymentStatus = body.status;

      const payment = await Payment.findOne({
        where: { provider_transactions: body.id },
      });

      if (!payment) return res.status(404).json({ message: "Payment not found" });

      const order = await Order.findByPk(payment.order_id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      if (paymentStatus === "PAID") {
        await payment.update({
          status: "paid",
          paid_at: new Date(),
          raw_callback_log: JSON.stringify(body)
        });

        await order.update({ status: "paid" });

        // 🔥 Generate ALL tickets
        await ticketService.generateTickets(order.id);
      } else {
        await payment.update({
          status: "failed",
          raw_callback_log: JSON.stringify(body)
        });

        await order.update({ status: "canceled" });
      }

      return res.json({ success: true });

    } catch (err) {
      console.log("Callback error:", err);
      res.status(500).json({ message: "Callback error" });
    }
  }
};
