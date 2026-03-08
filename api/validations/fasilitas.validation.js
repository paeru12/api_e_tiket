const Joi = require("joi");

module.exports = {
  create: Joi.object({
    name: Joi.string().required(),
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    icon: Joi.string().optional(),
  })
};
