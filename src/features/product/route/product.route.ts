import express from 'express';
import { productController } from '../controller/product.controller';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { createProductSchema } from '../schema/product.schema';

const productRoute = express.Router();

productRoute.post(
    '/',
    validateSchema(createProductSchema),
    productController.create
);

productRoute.get('/', productController.read);

productRoute.get('/:id', productController.readSingle);

productRoute.put(
    '/:id',
    validateSchema(createProductSchema),
    productController.update
);

productRoute.delete('/:id', productController.delete);

export default productRoute;
