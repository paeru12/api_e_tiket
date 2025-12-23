const Joi = require("joi");

module.exports = {
  create: Joi.object({
    user_id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow("", null),
    keywords: Joi.string().allow("", null)
  }),

  update: Joi.object({
    user_id: Joi.string().required(),
    name: Joi.string().optional(),
    description: Joi.string().allow("", null),
    keywords: Joi.string().allow("", null)
  })
};