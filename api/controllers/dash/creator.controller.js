const service = require("../../services/dash/creator.service");
const processImage = require("../../utils/imageProcessor");

module.exports = {
  async index(req, res) {
    try {
      const data = await service.getAll();
      res.json({ success: true, message: "Creators retrieved", data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async show(req, res) {
    try {
      const creator = await service.getOne(req.params.id);
      if (!creator) {
        return res.status(404).json({ success: false, message: "Creator not found" });
      }
      res.json({ success: true, message: "Creator found", data: creator });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async showBySlug(req, res) {
    try {
      const creator = await service.getBySlug(req.params.slug);
      if (!creator) {
        return res.status(404).json({ success: false, message: "Creator not found" });
      }
      res.json({ success: true, message: "Creator found", data: creator });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async store(req, res) {
    try {
      let imageUrl = null;

      if (req.file) {
        imageUrl = await processImage(req.file.buffer, "creators");
      }

      const creator = await service.create({
        user_id: req.body.user_id,
        name: req.body.name,
        image: imageUrl,
      });

      res.status(201).json({
        success: true,
        message: "Creator created",
        data: creator,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      let data = {
        user_id: req.body.user_id,
        name: req.body.name,
      };

      if (req.file) {
        data.image = await processImage(req.file.buffer, "creators");
      }

      const creator = await service.update(req.params.id, data);

      res.json({ success: true, message: "Creator updated", data: creator });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const result = await service.remove(req.params.id);
      res.json({ success: true, message: "Creator deleted", data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
