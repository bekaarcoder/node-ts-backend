import Joi from 'joi';

export const addToCartSchema = Joi.object({
    productId: Joi.number().integer().required(),
});
