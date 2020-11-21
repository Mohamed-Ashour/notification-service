const Joi = require('joi');

module.exports = {
    notification: Joi.object({
        title: Joi.string().required(),
        message: Joi.string().required(),
        language: Joi.string().valid('ar', 'en').required(),
        provider: Joi.string().valid('apns', 'fcm', 'mail', 'sms').required(),
        type: Joi.string().valid('group', 'personal').required(),
        destinations: Joi.array().items(Joi.string()).required(),
    }),
};
