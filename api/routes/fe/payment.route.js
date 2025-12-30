const router = require("express").Router();
const controller = require("../../controllers/fe/payment.controller");
const controllers = require("../../controllers/fe/paymentCallback.controller");

router.post("/create-invoice", controller.createInvoice);
router.post("/xendit-callback", controllers.xenditCallback);
 
module.exports = router;
