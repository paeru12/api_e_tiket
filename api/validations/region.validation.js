const Joi = require("joi");

module.exports = {
  create: Joi.object({
    user_id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().optional(),
    keywords: Joi.string().optional()
  }),

  update: Joi.object({
    user_id: Joi.string().required(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    keywords: Joi.string().optional()
  })
};
