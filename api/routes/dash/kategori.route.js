const router = require("express").Router();
const controller = require("../../controllers/dash/kategori.controller");
const upload = require("../../middlewares/uploadImage.middleware");
const validate = require("../../middlewares/validate.middleware");
const schema = require("../../validations/kategori.validation");

router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", upload.single("image"),validate(schema.create), controller.store);
router.put("/:id", upload.single("image"),validate(schema.create), controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;
