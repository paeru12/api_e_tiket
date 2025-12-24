const router = require("express").Router();
const userRoute = require("./user.route");
const customerAuthRoute = require("./customerAuth.route");
const apikey = require("../middlewares/apikey");
const jwtkey = require("../middlewares/authh.middleware");
const adminAuthRoute = require("./adminAuth.route");
const kategoriRoute = require("./kategori.route");
const regionRoute = require("./region.route");
const creatorRoute = require("./creator.route");
const eventRoute = require("./event.route"); 
const ticket_typeRoute = require("./ticket_type.route");
const checkoutRoute = require("./checkout.route");
const paymentRoute = require("./payment.route");
const paymentCallbackRoute = require("./paymentCallback.route");

router.use("/auth/admin",apikey, adminAuthRoute);
router.use("/users", apikey, jwtkey, userRoute);
router.use("/kategoris", apikey, jwtkey, kategoriRoute);
router.use("/regions", apikey, jwtkey, regionRoute);
router.use("/creators", apikey, jwtkey, creatorRoute);
router.use("/events", apikey, jwtkey, eventRoute);
router.use("/ticket-types", apikey, jwtkey, ticket_typeRoute);
router.use("/checkout", apikey, jwtkey, checkoutRoute);
router.use("/payment", apikey, jwtkey, paymentRoute);
router.use("/callback/payment", apikey, jwtkey, paymentCallbackRoute);
// For customer auth routes
router.use("/auth/customer", apikey, customerAuthRoute);


// fallback 404 — best practice API
router.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
  });
});

module.exports = router;
