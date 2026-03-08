const service = require("../../../services/dash/scan/staff.service");

module.exports = {

  async assignStaff(req, res) {
    try {

      const result = await service.assignStaff(req.body);

      res.json({
        success: true,
        message: "Staff assigned",
        data: result
      });

    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  },

  async acceptAssignment(req, res) {

    try {

      const result = await service.acceptAssignment(req.body);

      res.json({
        success: true,
        message: "Assignment accepted",
        data: result
      });

    } catch (err) {

      res.status(400).json({
        success: false,
        message: err.message
      });

    }

  },

  async myAssignments(req, res) {

    try {

      const userId = req.user.id;

      const result = await service.myAssignments(userId);

      res.json({
        success: true,
        data: result
      });

    } catch (err) {

      res.status(400).json({
        success: false,
        message: err.message
      });

    }

  },

  async getAssignedEvents(req, res) {

    try {

      const data = await service.getAssignedEvents(req.user.id);

      res.json({
        success: true,
        data
      });

    } catch (err) {

      res.status(400).json({
        success: false,
        message: err.message
      });

    }

  },

  async acceptAssignment(req, res) {

    try {

      const data = await service.acceptAssignment(
        req.params.id,
        req.user.id
      );

      res.json({
        success: true,
        message: "Assignment accepted",
        data
      });

    } catch (err) {

      res.status(400).json({
        success: false,
        message: err.message
      });

    }

  }

};