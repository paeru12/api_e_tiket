const router = require("express").Router();
const controller = require("../../../controllers/dash/scan/scanner.controller");

router.post("/scan", controller.scanTicket);

module.exports = router;