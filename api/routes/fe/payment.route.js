const router = require("express").Router();
const controller = require("../../controllers/fe/payment.controller");

router.post("/create-invoice", controller.createInvoice);
module.exports = router;
