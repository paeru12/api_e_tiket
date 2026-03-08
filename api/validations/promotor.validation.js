const Joi = require("joi");

module.exports = {
    registerPromotor: Joi.object({
        full_name: Joi.string().required(),
        organizer_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirm_password: Joi.string().valid(Joi.ref('password')).required()
            .messages({ "any.only": "Password confirmation does not match" }),
        phone: Joi.string().optional()
    }),

    createPromotorMember: Joi.object({
        email: Joi.string().email().required(),
        full_name: Joi.string().required(),
        phone: Joi.string().optional(),
        password: Joi.string().min(6).required(),
        confirm_password: Joi.string().valid(Joi.ref('password')).required()
            .messages({ "any.only": "Password confirmation does not match" })
    }),

    updatePromotorMember: Joi.object({
        full_name: Joi.string().optional(),
        phone: Joi.string().optional(),
        image: Joi.string().optional(),
        is_active: Joi.boolean().optional()
    }),

    updatePromotorPassword: Joi.object({
        current_password: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        confirm_password: Joi.string().valid(Joi.ref('password')).required()
            .messages({ "any.only": "Password confirmation does not match" }),
    }),
};