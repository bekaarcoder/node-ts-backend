import express from 'express';
import { verifyUser } from '~/globals/middleware/auth.middleware';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { userController } from '../controller/user.controller';
import { userSchemaCreate, userSchemaUpdate } from '../schema/user.schema';

const userRoute = express.Router();

userRoute.post(
    '/',
    validateSchema(userSchemaCreate),
    userController.createUser
);

userRoute.put(
    '/:id',
    verifyUser,
    validateSchema(userSchemaUpdate),
    userController.updateUser
);

userRoute.get('/me', verifyUser, userController.getMe);

export default userRoute;
