import { prisma } from '~/prisma';
import { productService } from './product.service';
import {
    BadRequestException,
    NotFoundException,
} from '~/globals/middleware/error.middleware';
import { userService } from './user.service';
import { Cart, CartItem } from '@prisma/client';

class CartService {
    public async add(requestBody: any, currentUser: IUserPayload) {
        const { productId, variant, quantity } = requestBody;

        const product = await productService.getById(productId);

        // check if cart already exist, don't create a new one
        const user = await userService.getById(currentUser.id);

        let cart: Cart;

        if (!user.cart?.id) {
            cart = await prisma.cart.create({
                data: {
                    totalPrice: 0,
                    userId: currentUser.id,
                },
            });
        } else {
            cart = user.cart;
        }

        // check if product already exists in cart, increase the quantity
        const existingCartItems = await this.getCartItems(cart.id);

        const foundItem = existingCartItems.find(
            (item) => item.productId === product.id
        );

        let cartItem: CartItem;
        if (!foundItem) {
            cartItem = await prisma.cartItem.create({
                data: {
                    productId,
                    variant,
                    cartId: cart.id,
                    price: quantity ? product.price * quantity : product.price,
                    quantity,
                },
            });
        } else {
            const itemQuantity = quantity ? quantity : foundItem.quantity + 1;
            cartItem = await prisma.cartItem.update({
                where: {
                    id: foundItem.id,
                },
                data: {
                    quantity: itemQuantity,
                    price: product.price * itemQuantity,
                },
            });
        }

        const currentCartItems = await this.getCartItems(cart.id);
        const totalPrice = currentCartItems.reduce(
            (acc, item) => acc + item.price,
            0
        );

        const updatedCart = await prisma.cart.update({
            where: {
                id: cartItem.cartId,
            },
            data: {
                totalPrice: totalPrice,
            },
        });

        return updatedCart;
    }

    private async getCart(id: number) {
        const cart = await prisma.cart.findFirst({
            where: {
                id,
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        return cart;
    }

    private async getCartItems(cartId: number) {
        const cartItems = await prisma.cartItem.findMany({
            where: {
                cartId,
            },
        });
        return cartItems;
    }
}

export const cartService: CartService = new CartService();
