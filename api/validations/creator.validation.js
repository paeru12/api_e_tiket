const Joi = require("joi");

module.exports = {
  create: Joi.object({
    owner_user_id: Joi.string().required(),
    name: Joi.string().required(),
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    social_link: Joi.object().optional(),
    image: Joi.string().optional(),
  }),
};
