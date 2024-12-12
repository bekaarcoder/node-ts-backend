import { NextFunction, Request, Response } from 'express';
import { Schema, ValidationErrorItem } from 'joi';

const formatJoiMessage = (joiMessages: ValidationErrorItem[]) => {
    return joiMessages.map((obj) => ({
        message: obj.message.replace(/['"]/g, ''),
        path: obj.path,
    }));
};

export const validateSchema = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const message = formatJoiMessage(error.details);
            res.status(400).json({ error: message });
            return;
        }

        next();
    };
};
