const service = require("../../services/dash/user.service");
const processImage = require("../../utils/imageProcessor");

module.exports = {

  async pagination(req, res) {
    const { page = 1, perPage = 10, search = "" } = req.query;

    const result = await service.getPagination({ page, perPage, search });

    res.json({
      success: true,
      message: "Users retrieved",
      media: process.env.MEDIA_URL,
      data: result.rows,
      meta: {
        page: Number(page),
        perPage: Number(perPage),
        totalItems: result.count,
        totalPages: result.totalPages
      }
    });
  },

  async getOne(req, res) {
    try {
      const data = await service.getOne(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.json({
        success: true,
        message: "User found",
        data
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  },

  async createAdmin(req, res) {
    try {
      const data = { ...req.body };

      if (req.file) {
        data.image = await processImage(req.file.buffer, "users");
      }

      const user = await service.createAdmin(data);

      res.status(201).json({
        success: true,
        message: "User event admin created",
        data: user
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  },

  async update(req, res) {
    try {
      const checkUser = await service.getOne(req.params.id);
      if (!checkUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const data = {
        full_name: req.body.full_name,
        phone: req.body.phone,
        is_active: req.body.is_active
      };

      // Update avatar hanya jika upload baru
      if (req.file) {
        data.image = await processImage(
          req.file.buffer,
          "users",
          { maxWidth: 400, maxSize: 200 * 1024 }
        );
      }

      const user = await service.update(req.params.id, data);

      res.json({
        success: true,
        message: "User updated",
        data: user
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  },

  async updateGlobalPassword(req, res) {
    try {
      const result = await service.updateGlobalPassword(req.params.id, req.body);
      res.json({
        success: true,
        message: "password updated successfully",
        data: result
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  },

  async remove(req, res) {
    try {
      const checkUser = await service.getOne(req.params.id);
      if (!checkUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const result = await service.remove(req.params.id);

      res.json({
        success: true,
        message: "User deleted",
        data: result
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  },

};
