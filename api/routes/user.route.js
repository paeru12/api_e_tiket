const router = require("express").Router();
const controller = require("../controllers/user.controller");
const validate = require("../middlewares/validate.middleware");
const schema = require("../validations/user.validation");
const rateLimit = require("express-rate-limit");
const upload = require("../middlewares/uploadImage.middleware");
// Anti brute-force untuk login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, please try again later",
});

// ---- Routes ----

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", upload.single("image"),validate(schema.create), controller.create);
router.put("/:id",upload.single("image"), validate(schema.update), controller.update);
router.delete("/:id", controller.remove);

// Assign Role
router.post("/:id/assign-role", validate(schema.assignRole), controller.assignRole);

module.exports = router;
