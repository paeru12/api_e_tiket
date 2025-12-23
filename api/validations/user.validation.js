const Joi = require("joi");

module.exports = {
  create: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    full_name: Joi.string().required(),
    phone: Joi.string().optional(),
    image: Joi.string().optional(),
    role_id: Joi.string().uuid().required()
  }),

  update: Joi.object({
    full_name: Joi.string().optional(),
    phone: Joi.string().optional(),
    image: Joi.string().optional(),
    is_active: Joi.boolean().truthy("1").falsy("0").optional(),
  }),

  assignRole: Joi.object({
    role_id: Joi.string().uuid().required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    full_name: Joi.string().required(),
    phone: Joi.string().optional(),
    image: Joi.string().optional(),
  })
};
