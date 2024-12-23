import express from 'express';
import {
    preventInactiveUser,
    verifyUser,
} from '~/globals/middleware/auth.middleware';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { userController } from '../controller/user.controller';
import {
    changePasswordSchema,
    userSchemaCreate,
    userSchemaUpdate,
} from '../schema/user.schema';
import { uploadAvatar } from '~/globals/helpers/Upload';

const userRoute = express.Router();

// global middleware
// userRoute.use(verifyUser)

userRoute.post(
    '/upload-avatar',
    verifyUser,
    uploadAvatar.single('avatar'),
    userController.uploadAvatar
);

userRoute.post(
    '/',
    validateSchema(userSchemaCreate),
    userController.createUser
);

userRoute.put(
    '/change-password',
    verifyUser,
    preventInactiveUser,
    validateSchema(changePasswordSchema),
    userController.changePassword
);

userRoute.put(
    '/:id',
    verifyUser,
    validateSchema(userSchemaUpdate),
    userController.updateUser
);

userRoute.delete(
    '/:id',
    verifyUser,
    preventInactiveUser,
    userController.deleteUser
);

userRoute.get('/me', verifyUser, userController.getMe);

export default userRoute;
