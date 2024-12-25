import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { cartService } from '~/services/db/cart.service';

class CartController {
    public async addToCart(req: Request, res: Response) {
        const updatedCart = await cartService.add(req.body, req.currentUser);

        res.status(HTTP_STATUS.CREATED).json(updatedCart);
    }

    public async clearCart(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        await cartService.clear(id, req.currentUser);

        res.status(HTTP_STATUS.OK).json({
            message: 'Cart cleared successfully',
        });
    }

    public async removeCartItem(req: Request, res: Response) {
        const cartId = parseInt(req.params.cartId);
        const cartItemId = parseInt(req.params.cartItemId);

        const updatedCart = await cartService.removeItem(
            cartId,
            cartItemId,
            req.body,
            req.currentUser
        );
        res.status(HTTP_STATUS.OK).json({
            message: 'Item removed from cart',
            cart: updatedCart,
        });
    }

    public async getMyCart(req: Request, res: Response) {
        const userCart = await cartService.getUserCart(req.currentUser);

        res.status(HTTP_STATUS.OK).json(userCart);
    }
}

export const cartController: CartController = new CartController();
