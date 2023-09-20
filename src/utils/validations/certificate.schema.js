const Joi = require('joi');

const certificateValidationSchema = Joi.object({
    name: Joi.string().required(),
    title: Joi.string().required(),
    issueDate: Joi.date().iso().required(),
    status: Joi.string().valid('active', 'expired').required(),
    expiredDate: Joi.date().iso().required()
});

module.exports = certificateValidationSchema;
