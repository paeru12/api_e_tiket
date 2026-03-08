const { Event, Ticket } = require("../../../models");

module.exports.scanStaffGuard = () => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      // Must be scan staff OR superadmin
      const isScanStaff = user.creatorRoles?.includes("SCAN_STAFF");
      const isSuperAdmin = user.globalRoles?.includes("SUPERADMIN");

      if (!isScanStaff && !isSuperAdmin) {
        return res.status(403).json({
          status: false,
          message: "Only scan staff can access this endpoint"
        });
      }

      // SUPERADMIN full bypass
      if (isSuperAdmin) return next();

      // Get ticket ID from params
      const ticketId = req.params.ticketId;

      if (!ticketId) {
        return res.status(400).json({
          status: false,
          message: "ticketId is required"
        });
      }

      // Retrieve the ticket
      const ticket = await Ticket.findOne({
        where: { id: ticketId },
      });

      if (!ticket) {
        return res.status(404).json({
          status: false,
          message: "Ticket not found"
        });
      }

      // Get event related to the ticket
      const event = await Event.findOne({
        where: { id: ticket.event_id },
      });

      if (!event) {
        return res.status(404).json({
          status: false,
          message: "Event not found"
        });
      }

      // Enforce creator match
      if (event.creator_id !== user.creator_id) {
        return res.status(403).json({
          status: false,
          message: "Scan staff cannot scan tickets for another creator"
        });
      }

      next();
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Scan access check failed",
        error: err.message
      });
    }
  };
};
