import express from 'express';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { userSchemaCreate } from '../schema/user.schema';
import { asyncWrapper } from '~/globals/middleware/error.middleware';
import { authController } from '../controller/auth.controller';

const authRoute = express.Router();

authRoute.post(
    '/register',
    validateSchema(userSchemaCreate),
    asyncWrapper(authController.registerUser)
);

authRoute.post('/login', authController.loginUser);

export default authRoute;