const router = require("express").Router();
const controller = require("../../controllers/dash/fasilitas.controller");
const validate = require("../../middlewares/validate.middleware");
const schema = require("../../validations/fasilitas.validation");
const upload = require("../../middlewares/uploadImage.middleware");

router.get("/", controller.getAll);
router.get("/pagination", controller.getPagination);
router.post("/", upload.single("icon"), validate(schema.create), controller.store);
router.put("/:id", upload.single("icon"), validate(schema.update), controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;
