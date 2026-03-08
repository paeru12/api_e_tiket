// validations/settingsValidation.js
const Joi = require("joi");

module.exports = {
  // Validasi untuk update pajak
  updateTaxRateValidation: {
    body: Joi.object().keys({
      tax_rate: Joi.number().min(0).max(100).required(),
      service_tax_rate: Joi.number().min(0).max(100).required(),
    }),
  },
};