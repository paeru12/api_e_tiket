const router = require("express").Router();
const controller = require("../../controllers/fe/checkout.controller");

router.post("/", controller.checkout);

module.exports = router;
