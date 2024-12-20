import Joi from 'joi';

export const createProductVariantSchema = Joi.object({
    name: Joi.string().required(),
});
