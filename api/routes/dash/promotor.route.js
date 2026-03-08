const router = require("express").Router();
const validate = require("../../middlewares/validate.middleware");
const schema = require("../../validations/promotor.validation");
const controller = require("../../controllers/dash/promotor.controller");
const upload = require("../../middlewares/uploadImage.middleware");
const { creatorGuard } = require("../../middlewares/guard/role.guard");
const { autoFilterByCreator } = require("../../middlewares/autoFilterCreator.middleware");

router.get("/pagination", creatorGuard("PROMOTOR_OWNER", "PROMOTOR_EVENT_ADMIN"), autoFilterByCreator(), controller.getPagination);
router.get("/get-scann-staff", creatorGuard("PROMOTOR_OWNER", "PROMOTOR_EVENT_ADMIN",), autoFilterByCreator(), controller.getScanStaff);
router.post("/event-admin", creatorGuard("PROMOTOR_OWNER"), autoFilterByCreator(), validate(schema.createPromotorMember), controller.createPromotorEventAdmin);
router.post("/scan-staff", creatorGuard("PROMOTOR_OWNER"), autoFilterByCreator(), validate(schema.createPromotorMember), controller.createScanStaff);
router.put("/update-password/:id", creatorGuard("PROMOTOR_OWNER", "PROMOTOR_EVENT_ADMIN", "SCAN_STAFF"), autoFilterByCreator(), validate(schema.updatePromotorPassword), controller.updatePromotorPassword);
router.get("/", creatorGuard("PROMOTOR_OWNER", "PROMOTOR_EVENT_ADMIN"), autoFilterByCreator(), controller.getAll);
router.get("/:id", creatorGuard("PROMOTOR_OWNER", "PROMOTOR_EVENT_ADMIN", "SCAN_STAFF"), autoFilterByCreator(), controller.getOne);
router.put("/:id", creatorGuard("PROMOTOR_OWNER", "PROMOTOR_EVENT_ADMIN", "SCAN_STAFF"), autoFilterByCreator(), upload.single("image"), validate(schema.updatePromotorMember), controller.updatePromotorMember);
router.delete("/:id", creatorGuard("PROMOTOR_OWNER"), autoFilterByCreator(), controller.removePromotorMember);
module.exports = router;