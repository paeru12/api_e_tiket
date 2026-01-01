const router = require("express").Router();
const userRoute = require("./user.route");
const kategoriRoute = require("./kategori.route");
const regionRoute = require("./region.route");
const creatorRoute = require("./creator.route");
const eventRoute = require("./event.route");
const ticket_typeRoute = require("./ticket_type.route");

router.use("/users", userRoute);
router.use("/kategoris", kategoriRoute);
router.use("/regions", regionRoute);
router.use("/creators", creatorRoute);
router.use("/events", eventRoute);
router.use("/ticket-types", ticket_typeRoute);

module.exports = router;