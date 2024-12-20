import express from 'express';
import {
    authorizeRoles,
    verifyUser,
} from '~/globals/middleware/auth.middleware';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { createProductVariantItemSchema } from '../schema/product-variant-item.schema';
import { productVariantItemsController } from '../controller/product-variant-items.controller';

const productVariantItemsRoute = express.Router();

productVariantItemsRoute.post(
    '/:productId/:variantId',
    verifyUser,
    authorizeRoles('ADMIN', 'SHOP'),
    validateSchema(createProductVariantItemSchema),
    productVariantItemsController.addVariantItem
);

productVariantItemsRoute.delete(
    '/:productId/:variantId/:variantItemId',
    verifyUser,
    authorizeRoles('ADMIN', 'SHOP'),
    productVariantItemsController.deleteVariantItem
);

export default productVariantItemsRoute;
