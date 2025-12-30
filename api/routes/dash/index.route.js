const router = require("express").Router();
const userRoute = require("./user.route");
const kategoriRoute = require("./kategori.route");
const regionRoute = require("./region.route");
const creatorRoute = require("./creator.route");
const eventRoute = require("./event.route");
const ticket_typeRoute = require("./ticket_type.route");

router.use("/users", apikey, jwtkey, userRoute);
router.use("/kategoris", apikey, jwtkey, kategoriRoute);
router.use("/regions", apikey, jwtkey, regionRoute);
router.use("/creators", apikey, jwtkey, creatorRoute);
router.use("/events", apikey, jwtkey, eventRoute);
router.use("/ticket-types", apikey, jwtkey, ticket_typeRoute);

module.exports = router;