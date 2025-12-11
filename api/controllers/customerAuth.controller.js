const service = require("../services/customerAuth.service");

module.exports = {
  // API: POST /auth/customer/request-otp
  async requestOtp(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email wajib diisi" });

      const result = await service.requestOtp(email);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  // API: POST /auth/customer/verify-otp
  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp)
        return res.status(400).json({ message: "Email & OTP wajib diisi" });

      const result = await service.verifyOtp(email, otp);

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};
