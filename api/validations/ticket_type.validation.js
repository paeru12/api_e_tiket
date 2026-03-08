const Joi = require("joi");

module.exports = {
  bulkCreate: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      deskripsi: Joi.string().allow(null, ""),
      price: Joi.number().required(),
      total_stock: Joi.number().min(1).required(),
      max_per_order: Joi.number().min(1).required(),
      status: Joi.string().valid("draft", "available", "closed").default("draft"),
      admin_fee_included: Joi.boolean().default(true),
      tax_included: Joi.boolean().default(false),
      deliver_ticket: Joi.date().required(),
      date_start: Joi.date().required(),
      date_end: Joi.date().required(),
      time_start: Joi.string().required(),
      time_end: Joi.string().required(),
    })
  ),

  update: Joi.object({
    name: Joi.string().optional(),
    deskripsi: Joi.string().allow(null, "").optional(),
    price: Joi.number().optional(),
    total_stock: Joi.number().min(1).optional(),
    max_per_order: Joi.number().min(1).optional(),
    status: Joi.string().valid("draft", "available", "closed").optional(),
    admin_fee_included: Joi.boolean().optional(),
    tax_included: Joi.boolean().optional(),
    deliver_ticket: Joi.date().optional(),
    date_start: Joi.date().optional(),
    date_end: Joi.date().optional(),
    time_start: Joi.string().optional(),
    time_end: Joi.string().optional(),
  })
};
