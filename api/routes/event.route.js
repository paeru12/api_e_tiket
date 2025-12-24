const router = require("express").Router();
const controller = require("../controllers/event.controller");
const validate = require("../middlewares/validate.middleware");
const schema = require("../validations/event.validation");
const upload = require("../middlewares/uploadImage.middleware");

router.get("/", controller.index);
router.get("/:id", controller.show);
router.get("/slug/:slug", controller.slug);

router.post(
    "/",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "layout_venue", maxCount: 1 },
    ]),
    validate(schema.create),
    controller.store
);

router.put(
    "/:id",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "layout_venue", maxCount: 1 },
    ]),
    validate(schema.update),
    controller.update
);

router.delete("/:id", controller.destroy);

module.exports = router;
