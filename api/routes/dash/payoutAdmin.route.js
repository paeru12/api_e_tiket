const router = require("express").Router();
const controller = require("../../controllers/dash/admin/payoutApproval.controller");
const { globalGuard } = require("../../middlewares/guard/role.guard");

router.get("/",  controller.list);
router.get("/:id",  controller.detail);
router.post("/:id/approve",  controller.approve);
router.post("/:id/reject",  controller.reject);

module.exports = router;
