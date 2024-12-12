import express from 'express';
import { userController } from '../controller/user.controller';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { userSchemaCreate } from '../schema/user.schema';
import { asyncWrapper } from '~/globals/middleware/error.middleware';

const userRoute = express.Router();

userRoute.post(
    '/',
    validateSchema(userSchemaCreate),
    asyncWrapper(userController.createUser)
);

export default userRoute;
