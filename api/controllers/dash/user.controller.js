const service = require("../../services/dash/user.service");
const processImage = require("../../utils/imageProcessor");

module.exports = {
  async getAll(req, res) {
    try {
      const data = await service.getAll();
      res.json({
        success: true,
        message: "Users retrieved",
        data
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
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

  async create(req, res) {
    try {
      const data = { ...req.body };

      // Upload avatar jika ada
      if (req.file) {
        data.image = await processImage(
          req.file.buffer,
          "users",
          { maxWidth: 400, maxSize: 200 * 1024 }
        );
      }

      const user = await service.create(data);

      res.status(201).json({
        success: true,
        message: "User created",
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
        email: req.body.email,
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

  async assignRole(req, res) {
    try {
      const result = await service.assignRole(req.params.id, req.body);

      res.json({
        success: true,
        message: "Role assigned to user",
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
