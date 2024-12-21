import Joi from 'joi';

export const addToWishlistSchema = Joi.object({
    productId: Joi.number().integer().required(),
});
