const router = require("express").Router();
const controller = require("../../../controllers/dash/scan/staff.controller");
const { creatorGuard } = require("../../../middlewares/guard/role.guard");

router.post("/assign", controller.assignStaff);
router.post("/accept", controller.acceptAssignment);
router.get("/my-assignments", controller.myAssignments);

router.get(
  "/events",
  creatorGuard("SCAN_STAFF"),
  controller.getAssignedEvents
);

router.post(
  "/assignments/:id/accept",
  creatorGuard("SCAN_STAFF"),
  controller.acceptAssignment
);
module.exports = router;