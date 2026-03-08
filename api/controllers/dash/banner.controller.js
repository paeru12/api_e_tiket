const service = require("../../services/dash/banner.service");
const processImage = require("../../utils/imageProcessor");

module.exports = {
  async getPagination(req, res) {
    const { page = 1, perPage = 10, search = "" } = req.query;

    const result = await service.getPagination({ page, perPage, search });

    res.json({
      success: true,
      message: "Banner retrieved",
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

  async index(req, res) {
    res.json({
      success: true,
      message: "Banner retrieved",
      media: process.env.MEDIA_URL,
      data: await service.getAll()
    });
  },

  async show(req, res) {
    const data = await service.getOne(req.params.id);
    if (!data)
      return res.status(404).json({ success: false, message: "Banner not found" });

    res.json({ success: true, message: "Banner found", data });
  },

  async store(req, res) {
    try {
      let imageUrl = null;

      if (req.file) {
        imageUrl = await processImage(req.file.buffer, "banners");
      }

      const banner = await service.create({
        author_id: req.user.id,
        name: req.body.name,
        link: req.body.link,
        is_active: req.body.is_active,
        image_banner: imageUrl
      });

      res.status(201).json({ success: true, message: "Banner created", data: banner });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const check = await service.getOne(req.params.id);
      if (!check)
        return res.status(404).json({ success: false, message: "Banner not found" });

      const data = {
        name: req.body.name,
        link: req.body.link,
        is_active: req.body.is_active
      };

      if (req.file) {
        data.image_banner = await processImage(req.file.buffer, "banners");
      }

      const updated = await service.update(req.params.id, data);
      res.json({ success: true, message: "Banner updated", data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async destroy(req, res) {
    const check = await service.getOne(req.params.id);
    if (!check)
      return res.status(404).json({ success: false, message: "Banner not found" });

    try {
      res.json({
        success: true,
        message: "Banner deleted",
        data: await service.remove(req.params.id)
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
