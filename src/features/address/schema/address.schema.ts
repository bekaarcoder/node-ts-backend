import Joi from 'joi';

export const createAddressSchema = Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    pincode: Joi.number().integer().min(100000).max(999999).required(),
});
