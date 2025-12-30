const router = require("express").Router();
const controller = require("../../controllers/dash/ticket_type.controller");

router.get("/:event_id", controller.index);
router.get("/detail/:id", controller.show);
router.post("/bulk", controller.bulkStore);
router.put("/:id", controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;
