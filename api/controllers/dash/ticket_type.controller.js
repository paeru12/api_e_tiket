const service = require("../../services/dash/ticket_type.service");

module.exports = {

  async show(req, res) {
    const item = await service.getOne(req.params.ticketTypeId);
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: item });
  },

  async store(req, res) {
    try {
      const data = req.body.map(item => ({
        ...item,
        event_id: req.params.eventId
      }));

      const created = await service.create(data);

      res.status(201).json({ success: true, data: created });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const updated = await service.update(req.params.ticketTypeId, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const result = await service.remove(req.params.ticketTypeId);
      res.json({ success: true, message: "Deleted", data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
