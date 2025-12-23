const Joi = require("joi");

module.exports = {
  create: Joi.object({
    user_id: Joi.string().required(),
    name: Joi.string().required(),
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    user_id: Joi.string().optional(),
  }),
};
