const router = require("express").Router();
const controller = require("../../controllers/dash/imageUpload.controller");
const upload = require("../../middlewares/uploadImage.middleware");

router.post("/", upload.single("image"), controller.upload);
module.exports = router; 