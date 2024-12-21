import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { wishListService } from '~/services/db/wishlist.service';

class WishlistController {
    public async addToWishlist(req: Request, res: Response) {
        await wishListService.add(req.body, req.currentUser);

        res.status(HTTP_STATUS.CREATED).json({
            message: `Product added to wishlist`,
        });
    }

    public async deleteFromWishlist(req: Request, res: Response) {
        const productId = parseInt(req.params.productId);

        await wishListService.remove(productId, req.currentUser);

        res.status(HTTP_STATUS.OK).json({
            message: 'Product removed from wishlist',
        });
    }

    public async getUserWishlist(req: Request, res: Response) {
        const wishlistItems = await wishListService.getWishlistItems(
            req.currentUser
        );

        res.status(HTTP_STATUS.OK).json(wishlistItems);
    }
}

export const wishListController: WishlistController = new WishlistController();
