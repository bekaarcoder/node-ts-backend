import express from 'express';
import { productVariantsController } from '../controller/product-variants.controller';
import {
    authorizeRoles,
    verifyUser,
} from '~/globals/middleware/auth.middleware';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { createProductVariantSchema } from '../schema/product-variant.schema';

const productVariantsRoute = express.Router();

productVariantsRoute.post(
    '/:productId',
    validateSchema(createProductVariantSchema),
    verifyUser,
    authorizeRoles('ADMIN', 'SHOP'),
    productVariantsController.addVariant
);

productVariantsRoute.delete(
    '/:productId/:variantId',
    verifyUser,
    authorizeRoles('ADMIN', 'SHOP'),
    productVariantsController.deleteVariant
);

export default productVariantsRoute;
