import Joi from 'joi';

export const createCouponSchema = Joi.object({
    code: Joi.string().required(),
    discountPrice: Joi.number().integer().required(),
    discountType: Joi.string().valid('PERCENT', 'VALUE').optional(),
    isActive: Joi.boolean().optional(),
});

export const updateCouponSchema = Joi.object({
    discountPrice: Joi.number().integer().required(),
    discountType: Joi.string().valid('PERCENT', 'VALUE').optional(),
    isActive: Joi.boolean().optional(),
});
