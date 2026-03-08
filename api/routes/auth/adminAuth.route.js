const router = require("express").Router();
const controller = require("../../controllers/auth/adminAuth.controller");
const controller2 = require("../../controllers/auth/me.controller");
const jwtkey = require("../../middlewares/authh.middleware");
const validate = require("../../middlewares/validate.middleware");
const schemaReg = require("../../validations/promotor.validation");
const registers = require("../../controllers/dash/promotor.controller");
const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => ipKeyGenerator(req),
});

router.post("/login", loginLimiter,  controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);
router.get("/me", jwtkey, controller2);
router.post("/register-promotor", validate(schemaReg.registerPromotor), registers.registerPromotor);
module.exports = router;
