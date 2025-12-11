const router = require("express").Router();
const userRoute = require("./user.route");
const customerAuthRoute = require("./customerAuth.route");

router.use("/users", userRoute);
router.use("/auth/customer", customerAuthRoute);

// fallback 404 — best practice API
router.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
  });
});

module.exports = router;
