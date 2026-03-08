const router = require("express").Router();
const controller = require("../../controllers/dash/user.controller");
const validate = require("../../middlewares/validate.middleware");
const schema = require("../../validations/user.validation");
const upload = require("../../middlewares/uploadImage.middleware");

// ---- Routes ----
router.get("/pagination", controller.pagination);
router.get("/:id", controller.getOne);
router.post("/", upload.single("image"),validate(schema.create), controller.createAdmin);
router.put("/:id",upload.single("image"), validate(schema.update), controller.update);
router.put("/update-password/:id", validate(schema.updateGlobalPassword), controller.updateGlobalPassword);
router.delete("/:id", controller.remove);
module.exports = router;
