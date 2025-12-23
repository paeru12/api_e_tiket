const router = require("express").Router();
const userRoute = require("./user.route");
const customerAuthRoute = require("./customerAuth.route");
const apikey = require("../middlewares/apikey");
const jwtkey = require("../middlewares/authh.middleware");
const adminAuthRoute = require("./adminAuth.route");
const kategoriRoute = require("./kategori.route");
const regionRoute = require("./region.route");
const creatorRoute = require("./creator.route");

router.use("/auth/admin",apikey, adminAuthRoute);
router.use("/users", userRoute);
router.use("/auth/customer", apikey, customerAuthRoute);
router.use("/kategoris", apikey, jwtkey, kategoriRoute);
router.use("/regions", apikey, jwtkey, regionRoute);
router.use("/creators", apikey, jwtkey, creatorRoute);

// fallback 404 — best practice API
router.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
  });
});

module.exports = router;
