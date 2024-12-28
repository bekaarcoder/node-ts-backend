import Joi from 'joi';

export const UpdateOrderStatusSchema = Joi.object({
    status: Joi.string().valid('CONFIRMED', 'DELIVERED', 'PENDING', 'SHIPPED'),
});
