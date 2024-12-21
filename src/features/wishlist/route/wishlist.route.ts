import express from 'express';
import { verifyUser } from '~/globals/middleware/auth.middleware';
import { wishListController } from '../controller/wishlist.controller';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { addToWishlistSchema } from '../schema/wishlist.schema';

const wishListRoute = express.Router();

wishListRoute.post(
    '/',
    validateSchema(addToWishlistSchema),
    verifyUser,
    wishListController.addToWishlist
);

wishListRoute.delete(
    '/:productId',
    verifyUser,
    wishListController.deleteFromWishlist
);

wishListRoute.get('/', verifyUser, wishListController.getUserWishlist);

export default wishListRoute;
