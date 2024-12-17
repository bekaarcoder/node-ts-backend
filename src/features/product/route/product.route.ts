import express from 'express';
import { productController } from '../controller/product.controller';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { createProductSchema } from '../schema/product.schema';
import {
    authorizeRoles,
    isShop,
    verifyUser,
} from '~/globals/middleware/auth.middleware';

const productRoute = express.Router();

productRoute.post(
    '/',
    validateSchema(createProductSchema),
    verifyUser,
    authorizeRoles('SHOP', 'ADMIN'),
    productController.create
);

productRoute.get('/', productController.read);

productRoute.get('/:id', productController.readSingle);

productRoute.put(
    '/:id',
    validateSchema(createProductSchema),
    verifyUser,
    authorizeRoles('SHOP', 'ADMIN'),
    productController.update
);

productRoute.delete(
    '/:id',
    verifyUser,
    authorizeRoles('SHOP', 'ADMIN'),
    productController.delete
);

export default productRoute;
