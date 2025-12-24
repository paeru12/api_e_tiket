const Joi = require("joi");

module.exports = {
  create: Joi.object({
    creator_id: Joi.string().uuid().required(),
    region_id: Joi.string().uuid().required(),
    kategori_id: Joi.string().uuid().required(),
    user_id: Joi.string().uuid().required(),

    name: Joi.string().required(),

    deskripsi: Joi.string().allow("", null),
    sk: Joi.string().allow("", null),

    date_start: Joi.date().allow(null),
    date_end: Joi.date().allow(null),

    time_start: Joi.string().allow(null),
    time_end: Joi.string().allow(null),

    location: Joi.string().allow("", null),
    map: Joi.string().allow("", null),

    keywords: Joi.string().allow("", null),
    status: Joi.string().valid("draft", "published", "archived"),
  }),

  update: Joi.object({
    creator_id: Joi.string().uuid().optional(),
    region_id: Joi.string().uuid().optional(),
    kategori_id: Joi.string().uuid().optional(),
    name: Joi.string().optional(),
    deskripsi: Joi.string().optional(),
    sk: Joi.string().optional(),
    date_start: Joi.date().allow(null),
    date_end: Joi.date().allow(null),
    time_start: Joi.string().allow(null),
    time_end: Joi.string().allow(null),
    location: Joi.string().optional(),
    map: Joi.string().optional(),
    keywords: Joi.string().optional(),
  }),
};
