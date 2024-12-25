import express from 'express';
import { verifyUser } from '~/globals/middleware/auth.middleware';
import { cartController } from '../controller/cart.controller';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { addToCartSchema } from '../schema/cart.schema';

const cartRoute = express.Router();

cartRoute.get('/', verifyUser, cartController.getMyCart);

cartRoute.post(
    '/',
    verifyUser,
    validateSchema(addToCartSchema),
    cartController.addToCart
);

cartRoute.delete('/:id', verifyUser, cartController.clearCart);

cartRoute.put(
    '/:cartId/:cartItemId',
    verifyUser,
    cartController.removeCartItem
);

export default cartRoute;
