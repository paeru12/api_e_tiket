const Joi = require("joi");

module.exports = {
  create: Joi.object({
    name: Joi.string().required(),
    link: Joi.string().allow("", null),
    is_active: Joi.boolean().default(true)
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    link: Joi.string().allow("", null),
    is_active: Joi.boolean().optional()
  })
};
