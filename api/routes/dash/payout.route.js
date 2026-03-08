const router = require("express").Router();
const controller = require("../../controllers/dash/payout.controller");
const validate = require("../../middlewares/validate.middleware");
const schema = require("../../validations/payout.validation");
// Dashboard saldo & data ringkasan
router.get("/dashboard", controller.dashboard);

// Riwayat payout
router.get("/history", controller.history);

// Buat request payout
router.post("/", controller.create);

router.get("/creator-finance-setting/:creator_id", controller.getCreatorFinanceSetting);
router.put("/creator-finance-setting/:creator_id", controller.updateCreatorFinanceSetting);

router.get("/system-finance-setting", controller.getSystemFinanceSetting);
router.put("/system-finance-setting", controller.updateSystemFinanceSetting);
router.get("/bank/info", controller.bankInfo);

module.exports = router;