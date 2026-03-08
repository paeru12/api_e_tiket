const router = require("express").Router();
const controller = require("../../controllers/fe/fend.controller");
const checkoutRoute = require("./checkout.route");
const paymentRoute = require("./payment.route");
const customerAuthRoute = require("./customerAuth.route");

router.get("/home", controller.homeAll);
router.get("/banner", controller.bannerAll);
router.get("/kategori", controller.kategoriAll);
router.get("/kategori/:slug/events", controller.getEventByKategoriSlug);
router.get("/event", controller.eventAll);
router.get("/events", controller.searchEvents);
router.get("/event/:slug", controller.getOneEvent);
router.get("/event/tickets/:slug", controller.getTicketEvent);

router.use("/checkout", checkoutRoute);
router.use("/payment", paymentRoute);

router.use("/auth/customer", customerAuthRoute);
module.exports = router;
