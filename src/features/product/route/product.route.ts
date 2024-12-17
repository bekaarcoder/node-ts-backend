import express from 'express';
import { productController } from '../controller/product.controller';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { createProductSchema } from '../schema/product.schema';
import {
    authorizeRoles,
    isShop,
    verifyUser,
} from '~/globals/middleware/auth.middleware';
import { upload } from '~/globals/helpers/Upload';

const productRoute = express.Router();

productRoute.post(
    '/',
    verifyUser,
    authorizeRoles('SHOP', 'ADMIN'),
    upload.single('mainImage'),
    validateSchema(createProductSchema),
    productController.create
);

productRoute.get('/', productController.read);

productRoute.get('/vendor', verifyUser, productController.getAllUserProducts);

productRoute.get('/:id', productController.readSingle);

productRoute.put(
    '/:id',
    verifyUser,
    authorizeRoles('SHOP', 'ADMIN'),
    upload.single('mainImage'),
    validateSchema(createProductSchema),
    productController.update
);

productRoute.delete(
    '/:id',
    verifyUser,
    authorizeRoles('SHOP', 'ADMIN'),
    productController.delete
);

export default productRoute;
