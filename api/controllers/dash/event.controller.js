const service = require("../../services/dash/event.service");
const processImage = require("../../utils/imageProcessor");

module.exports = {
  async index(req, res) {
    try {
      res.json({
        success: true,
        message: "Events retrieved",
        data: await service.getAll(),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async show(req, res) {
    try {
      const data = await service.getOne(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
      res.json({ success: true, message: "Event found", data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  async slug(req, res) {
    try {
      const data = await service.getBySlug(req.params.slug);
      if (!data) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
      res.json({ success: true, message: "Event found", data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async store(req, res) {
    try {
      const data = { ...req.body };

      if (req.files?.image) {
        data.image = await processImage(req.files.image[0].buffer, "events");
      }
      if (req.files?.layout_venue) {
        data.layout_venue = await processImage(
          req.files.layout_venue[0].buffer,
          "events"
        );
      }

      const event = await service.create(data);

      res.status(201).json({
        success: true,
        message: "Event created",
        data: event,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async storeAll(req, res) {
    try {
      const data = { ...req.body };

      if (req.files?.image?.length) {
        data.image = await processImage(
          req.files.image[0].buffer,
          "events"
        );
      }

      if (req.files?.layout_venue?.length) {
        data.layout_venue = await processImage(
          req.files.layout_venue[0].buffer,
          "events"
        );
      }

      const event = await service.createAll(data);

      return res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: event,
      });

    } catch (err) {
      console.error("Create Event Error:", err);

      return res.status(400).json({
        success: false,
        message: err.message || "Failed to create event",
      });
    }
  },

  async update(req, res) {
    try {
      const data = { ...req.body };

      if (req.files?.image) {
        data.image = await processImage(
          req.files.image[0].buffer,
          "events"
        );
      }

      if (req.files?.layout_venue) {
        data.layout_venue = await processImage(
          req.files.layout_venue[0].buffer,
          "events"
        );
      }

      const event = await service.update(req.params.id, data);

      res.json({ success: true, message: "Event updated", data: event });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const response = await service.remove(req.params.id);
      res.json({ success: true, message: "Event deleted", data: response });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
