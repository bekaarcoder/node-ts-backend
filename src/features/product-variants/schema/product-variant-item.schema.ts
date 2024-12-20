import Joi from 'joi';

export const createProductVariantItemSchema = Joi.object({
    name: Joi.string().required(),
});
