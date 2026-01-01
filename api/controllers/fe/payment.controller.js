const service = require("../../services/fe/payment.service");
 
module.exports = {
  async createInvoice(req, res) {
    try {
      const { order_id } = req.body;
      const result = await service.createInvoice(order_id);
 
      return res.json({
        success: true,
        message: "Invoice created",
        data: result,
      });

    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
