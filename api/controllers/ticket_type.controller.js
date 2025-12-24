const service = require("../services/ticket_type.service");
const validate = require("../validations/ticket_type.validation");

module.exports = {
  async index(req, res) {
    const event_id = req.params.event_id;
    const data = await service.getAll(event_id);
    res.json({ success: true, data });
  },

  async show(req, res) {
    const item = await service.getOne(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: item });
  },

  async bulkStore(req, res) {
    try {
      const { error } = validate.bulkCreate.validate(req.body);
      if (error) return res.status(400).json({ success: false, message: error.message });

      const tickets = await service.bulkCreate(req.body);

      res.status(201).json({ success: true, message: "Tickets created", data: tickets });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const updated = await service.update(req.params.id, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const result = await service.remove(req.params.id);
      res.json({ success: true, message: "Deleted", data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
