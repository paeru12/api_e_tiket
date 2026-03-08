const service = require("../../../services/dash/scan/scanner.service");

module.exports = {

  async scanTicket(req, res) {

    try {

      const result = await service.scanTicket({
        ...req.body,
        user_id: req.user.id
      });

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

  }

};