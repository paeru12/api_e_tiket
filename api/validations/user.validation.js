const Joi = require("joi");

module.exports = {
  update: Joi.object({
    full_name: Joi.string().optional(),
    phone: Joi.string().optional(),
    image: Joi.string().optional(),
    is_active: Joi.boolean().truthy("1").falsy("0").optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  create: Joi.object({
    role: Joi.string().valid(
      "SYSTEM_ADMIN",
      "CONTENT_WRITER"
    ).required(),
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required()
      .messages({ "any.only": "Password confirmation does not match" }),
  }),

  updateGlobalPassword: Joi.object({
    current_password: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required()
      .messages({ "any.only": "Password confirmation does not match" }),
  }),

};
