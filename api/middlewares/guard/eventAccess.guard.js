const { Event } = require("../../../models");

module.exports.eventAccessGuard = () => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const eventId = req.params.eventId; // /creator/:creatorId/event/:eventId
      console.log(eventId);
      if (!eventId) {
        return res.status(400).json({
          status: false,
          message: "eventId is required"
        });
      }

      // SUPERADMIN bypass
      if (user.globalRoles?.includes("SUPERADMIN")) {
        return next();
      }

      // User must be tied to a creator
      if (!user.creator_id) {
        return res.status(403).json({
          status: false,
          message: "You are not tied to any creator"
        });
      }

      // Cek event milik siapa
      const event = await Event.findOne({
        where: { id: eventId },
      });

      if (!event) {
        return res.status(404).json({
          status: false,
          message: "Event not found"
        });
      }

      if (event.creator_id !== user.creator_id) {
        return res.status(403).json({
          status: false,
          message: "You cannot access an event from another creator"
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Event validation failed",
        error: err.message
      });
    }
  };
};
