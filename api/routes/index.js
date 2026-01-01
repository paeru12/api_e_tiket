const router = require("express").Router();
const apikey = require("../middlewares/apikey");
const apikeyfend = require("../middlewares/apikeysfend");
const jwtkey = require("../middlewares/authh.middleware");
const dashRoute = require("./dash/index.route");
const adminAuthRoute = require("./auth/adminAuth.route");
const fendRoute = require("./fe/fend.route");
const controllers = require("../controllers/fe/paymentCallback.controller");
router.use("/auth/admin",apikey, adminAuthRoute); // admin authentication routes
router.use("/vi4", apikey, jwtkey, dashRoute); // dashboard routes

router.use("/v1", apikeyfend, fendRoute); // frontend routes
// router.post("/xendit-callback", controllers.xenditCallback);

router.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
  });
});

module.exports = router;
