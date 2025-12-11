const router = require("express").Router();
const controller = require("../controllers/customerAuth.controller");

// Kirim OTP
router.post("/request-otp", controller.requestOtp);

// Verifikasi OTP
router.post("/verify-otp", controller.verifyOtp);

module.exports = router;
