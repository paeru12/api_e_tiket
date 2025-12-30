const router = require("express").Router();
const apikey = require("../middlewares/apikey");
const apikeyfend = require("../middlewares/apikeysfend");
const jwtkey = require("../middlewares/authh.middleware");
const fendRoute = require("./fe/fend.route");
const dashRoute = require("./dash/index.route");
const adminAuthRoute = require("./auth/adminAuth.route");

router.use("/v1", apikeyfend, fendRoute); // frontend routes
router.use("/auth/admin",apikey, adminAuthRoute); // admin authentication routes
router.use("/vi4", apikey, jwtkey, dashRoute); // dashboard routes

router.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
  });
});

module.exports = router;
