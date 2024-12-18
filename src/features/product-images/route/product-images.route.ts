import express from 'express';
import { productImagesController } from '../controller/product-images.controller';
import { upload } from '~/globals/helpers/Upload';
import {
    authorizeRoles,
    verifyUser,
} from '~/globals/middleware/auth.middleware';

const productImagesRoute = express.Router();

productImagesRoute.post(
    '/:productId',
    verifyUser,
    authorizeRoles('ADMIN', 'SHOP'),
    upload.array('images', 10),
    productImagesController.addImages
);

productImagesRoute.delete(
    '/:id',
    verifyUser,
    authorizeRoles('ADMIN', 'SHOP'),
    productImagesController.delete
);

export default productImagesRoute;
