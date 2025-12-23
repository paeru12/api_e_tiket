// api/controllers/customerAuth.controller.js
const service = require("../services/customerAuth.service");

module.exports = {
  async requestOtp(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ status: false, message: "Email required" });

      const result = await service.requestOtp(email);
      return res.json({ status: true, ...result });
    } catch (err) {
      // send structured error
      const code = err.statusCode || 500;
      return res.status(code).json({ status: false, message: err.message || "Internal error", ...(err.retryAfter ? { retryAfter: err.retryAfter } : {}) });
    }
  },

  async verifyOtp(req, res, next) {
    try {
      const { email, otp, code } = req.body;
      const inputOtp = otp || code;
      if (!email || !inputOtp) return res.status(400).json({ status: false, message: "Email and OTP required" });

      const result = await service.verifyOtp(email, inputOtp);
      // at this point you can issue a JWT in controller if you prefer; service returns customer
      // Example: create JWT here (if you have jwt util)
      const jwtUtil = require("../../utils/jwt");
      const token = jwtUtil.generateAccess(result.customer.id);

      return res.json({ status: true, message: result.message, data: { customer: result.customer, token } });
    } catch (err) {
      const code = err.statusCode || 500;
      return res.status(code).json({ status: false, message: err.message || "Internal error" });
    }
  }
};
