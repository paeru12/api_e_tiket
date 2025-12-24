const router = require("express").Router();
const controller = require("../controllers/checkout.controller");

router.post("/", controller.checkout);

module.exports = router;
