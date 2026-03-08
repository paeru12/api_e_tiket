// routes/settings.js

const express = require("express");
const controller = require("../../controllers/dash/setting.controller");
const router = express.Router();
const { creatorGuard } = require("../../middlewares/guard/role.guard");
const { autoFilterByCreator } = require("../../middlewares/autoFilterCreator.middleware");
// Get tax rate
router.get("/tax-rate", controller.getTaxRate);
router.get("/admin-fee", creatorGuard("PROMOTOR_OWNER", "PROMOTOR_EVENT_ADMIN"), autoFilterByCreator(), controller.getAdminFee);

// Update tax rate
router.put("/tax-rate", controller.updateTaxRate);

module.exports = router;