const Joi = require("joi");

const ticketSchema = Joi.object({
  name: Joi.string().required(),
  deskripsi: Joi.string().allow("", null),
  price: Joi.number().positive().required(),
  total_stock: Joi.number().integer().min(1).required(),
  max_per_order: Joi.number().integer().min(1).required(),
  status: Joi.string().valid("draft", "available", "closed").default("draft"),
  admin_fee_included: Joi.boolean().default(true),
  tax_included: Joi.boolean().default(false),
  deliver_ticket: Joi.date().required(),
  date_start: Joi.date().required(),
  date_end: Joi.date().required(),
  time_start: Joi.string().required(),
  time_end: Joi.string().required(),
});

module.exports = {
  create: Joi.object({
    kategori_id: Joi.string().uuid().required(),

    name: Joi.string().required(),
    deskripsi: Joi.string().allow("", null),
    sk: Joi.string().allow("", null),

    date_start: Joi.date().allow(null),
    date_end: Joi.date().allow(null),
    time_start: Joi.string().allow(null),
    time_end: Joi.string().allow(null),
    timezone: Joi.string().allow(null), 

    location: Joi.string().allow("", null),
    map: Joi.string().allow("", null),
    province: Joi.string().allow("", null),
    district: Joi.string().allow("", null),
    keywords: Joi.string().allow("", null),
    status: Joi.string().valid("draft", "published", "ended").default("draft"),
    social_link: Joi.object().optional(),
    image: Joi.string().optional(),
    ticket_types: Joi.array().items(ticketSchema).min(1).required(),
  }),


};
