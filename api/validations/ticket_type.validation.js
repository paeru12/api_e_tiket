const Joi = require("joi");

module.exports = {
  bulkCreate: Joi.array().items(
    Joi.object({
      event_id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      deskripsi: Joi.string().allow(null, ""),
      price: Joi.number().required(),
      total_stock: Joi.number().min(1).required(),
      max_per_order: Joi.number().min(1).required(),
      status: Joi.string().valid("draft", "available", "closed").default("draft"),
      is_active: Joi.boolean().default(true),
      deliver_ticket: Joi.date().required(),
      date_start: Joi.date().required(),
      date_end: Joi.date().required(),
      time_start: Joi.string().required(),
      time_end: Joi.string().required(),
    })
  ),
};
