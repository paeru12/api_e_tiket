const Joi = require("joi");

module.exports = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow("", null),
    keywords: Joi.string().allow("", null)
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().allow("", null),
    keywords: Joi.string().allow("", null)
  })
};