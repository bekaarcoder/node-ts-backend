import Joi from 'joi';

export const createProductSchema = Joi.object({
    name: Joi.string().required(),
    longDescription: Joi.string().required(),
    shortDescription: Joi.string().required(),
    quantity: Joi.number().integer().positive().required(),
    mainImage: Joi.string().required(),
    categoryId: Joi.number().integer().required(),
});
