const Joi = require("joi");

module.exports = {

  update: Joi.object({
    name: Joi.string().optional(),
    kategori_id: Joi.string().uuid().optional(),
    location: Joi.string().optional(),
    map: Joi.string().allow("", null),
    province: Joi.string().allow("", null),
    district: Joi.string().allow("", null),
    date_start: Joi.date().allow(null),
    date_end: Joi.date().allow(null),
    time_start: Joi.string().allow(null),
    time_end: Joi.string().allow(null),
    deskripsi: Joi.string().optional(),
    sk: Joi.string().optional(),
    keywords: Joi.string().optional(),
    lowest_price: Joi.string().optional(),
    timezone: Joi.string().optional(),
    social_link: Joi.object().optional(),
    image: Joi.string().optional(),
  }),
};
