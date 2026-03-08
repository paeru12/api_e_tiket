const Joi = require("joi");

module.exports = {
  pagination: Joi.object({
    page: Joi.number().optional(),
    perPage: Joi.number().optional(),
    search: Joi.string().optional(),
    status: Joi.string().valid("PENDING","PAID","EXPIRED","FAILED","REFUND","ALL").optional(),
  }),
};