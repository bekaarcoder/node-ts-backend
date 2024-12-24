import express from 'express';
import {
    preventInactiveUser,
    verifyUser,
} from '~/globals/middleware/auth.middleware';
import { addressController } from '../controller/address.controller';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { createAddressSchema } from '../schema/address.schema';

const addressRoute = express.Router();

addressRoute.post(
    '/',
    verifyUser,
    preventInactiveUser,
    validateSchema(createAddressSchema),
    addressController.addAddress
);

addressRoute.put(
    '/:id',
    verifyUser,
    preventInactiveUser,
    validateSchema(createAddressSchema),
    addressController.updateAddress
);

addressRoute.delete(
    '/:id',
    verifyUser,
    preventInactiveUser,
    addressController.deleteAddress
);

export default addressRoute;
