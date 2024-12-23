import Joi from 'joi';

export const userSchemaCreate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    avatar: Joi.optional(),
});

export const userSchemaUpdate = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    avatar: Joi.optional(),
});

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
    confirmPassword: Joi.ref('newPassword'),
});
