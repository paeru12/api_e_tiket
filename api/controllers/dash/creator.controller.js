const service = require("../../services/dash/creator.service");
const processImage = require("../../utils/imageProcessor");
const {
  CreatorDocuments,
  CreatorBankAccounts,
  CreatorFinanceSettings
} = require("../../../models");
module.exports = {

  async getPagination(req, res) {
    const { page = 1, perPage = 10, search = "" } = req.query;

    const result = await service.getPagination({ page, perPage, search });

    res.json({
      success: true,
      message: "Creators retrieved",
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
        name: req.body.name,
        social_link: req.body.social_link || null
      };

      if (req.file) {
        data.image = await processImage(req.file.buffer, "creators");
      }

      if (data.social_link && typeof data.social_link === "string") {
        data.social_link = JSON.parse(data.social_link);
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
  },

  // GET DOCUMENTS
  async getDocuments(req, res) {
    const docs = await CreatorDocuments.findOne({ where: { creator_id: req.params.id } });
    res.json({ success: true, data: docs });
  },

  // GET BANK ACCOUNTS
  async getBankAccounts(req, res) {
    const bank = await CreatorBankAccounts.findAll({ where: { creator_id: req.params.id } });
    res.json({ success: true, data: bank });
  },

  // GET FINANCE
  async getFinanceSettings(req, res) {
    const finance = await CreatorFinanceSettings.findOne({
      where: { creator_id: req.params.id },
    });
    res.json({ success: true, data: finance });
  },

  // UPDATE / CREATE FINANCE
  async updateFinanceSettings(req, res) {
    const { admin_fee_type, admin_fee_value } = req.body;

    let finance = await CreatorFinanceSettings.findOne({
      where: { creator_id: req.params.id },
    });

    if (!finance) {
      finance = await CreatorFinanceSettings.create({
        creator_id: req.params.id,
        admin_fee_type,
        admin_fee_value,
      });
    } else {
      await finance.update({ admin_fee_type, admin_fee_value });
    }

    res.json({
      success: true,
      message: "Finance settings updated",
      data: finance,
    });
  }

};