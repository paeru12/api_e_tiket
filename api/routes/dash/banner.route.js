const router = require("express").Router();
const controller = require("../../controllers/dash/banner.controller");
const upload = require("../../middlewares/uploadImage.middleware");
const validate = require("../../middlewares/validate.middleware");
const schema = require("../../validations/banner.validation");

router.get("/", controller.index);
router.get("/pagination", controller.getPagination);
router.get("/:id", controller.show);
router.post("/", upload.single("image_banner"), validate(schema.create), controller.store);
router.put("/:id", upload.single("image_banner"), validate(schema.update), controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;
