const router = require("express").Router();
const controller = require("../../controllers/dash/region.controller");
const upload = require("../../middlewares/uploadImage.middleware");
const validate = require("../../middlewares/validate.middleware");
const schema = require("../../validations/region.validation");

// PUBLIC
router.get("/slug/:slug", controller.showBySlug);
router.get("/slug/:slug/seo", controller.seo);

// ADMIN
router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", upload.single("image"), validate(schema.create), controller.store);
router.put("/:id", upload.single("image"), validate(schema.update), controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;
