const router = require("express").Router();
const controller = require("../../controllers/dash/region.controller");

router.get("/province", controller.province);
router.get("/district/:provinceId", controller.district);

module.exports = router;
