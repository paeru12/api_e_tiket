// validations/payoutValidation.js
const Joi = require("joi");

module.exports = {
  creatorFinanceSettingValidation: {
    body: Joi.object().keys({
      admin_fee_type: Joi.string().valid("flat", "percent").required(),
      admin_fee_value: Joi.number().min(0).required(),
    }),
  },

  systemFinanceSettingValidation: {
    body: Joi.object().keys({
      tax_rate: Joi.number().min(0).max(100).required(),
      service_tax_rate: Joi.number().min(0).max(100).optional(),
    }),
  },
};