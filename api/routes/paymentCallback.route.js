const router = require("express").Router();
const controller = require("../controllers/paymentCallback.controller");

router.post("/xendit", controller.xenditCallback);

module.exports = router;
