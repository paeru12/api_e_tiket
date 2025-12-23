const router = require("express").Router();
const controller = require("../controllers/creator.controller");
const validate = require("../middlewares/validate.middleware");
const schema = require("../validations/creator.validation");
const upload = require("../middlewares/uploadImage.middleware");

router.get("/", controller.index);
router.get("/:id", controller.show);
router.get("/slug/:slug", controller.showBySlug);

router.post("/", upload.single("image"), validate(schema.create), controller.store);
router.put("/:id", upload.single("image"), validate(schema.update), controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;
