import { Cart, CartItem } from '@prisma/client';
import { Helper } from '~/globals/helpers/Helper';
import { NotFoundException } from '~/globals/middleware/error.middleware';
import { prisma } from '~/prisma';
import { productService } from './product.service';
import { userService } from './user.service';
import {
    ICartBody,
    IUpdateCartBody,
} from '~/features/cart/interface/cart.interface';

class CartService {
    public async add(requestBody: ICartBody, currentUser: IUserPayload) {
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
                    price: product.price,
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
                },
            });
        }

        const updatedCart = await this.updateCart(cart.id);
        return updatedCart;
    }

    public async clear(cartId: number, currentUser: IUserPayload) {
        const cart = await this.getCart(cartId);
        Helper.checkPermission(cart, 'userId', currentUser);

        await prisma.cart.delete({
            where: {
                id: cart.id,
            },
        });
    }

    public async removeItem(
        cartId: number,
        cartItemId: number,
        requestBody: IUpdateCartBody,
        currentUser: IUserPayload
    ) {
        const { quantity } = requestBody;
        const cart = await this.getCart(cartId);
        Helper.checkPermission(cart, 'userId', currentUser);

        const cartItems = await this.getCartItems(cart.id);
        const foundItem = cartItems.find((item) => item.id === cartItemId);
        if (!foundItem) {
            throw new NotFoundException('Item not found in the cart');
        }

        if (quantity && foundItem.quantity > quantity) {
            await prisma.cartItem.update({
                where: {
                    id: foundItem.id,
                },
                data: {
                    quantity: foundItem.quantity - quantity,
                },
            });
        } else {
            await prisma.cartItem.delete({
                where: {
                    id: foundItem.id,
                },
            });
        }

        const updatedCart = await this.updateCart(cart.id);
        return updatedCart;
    }

    public async getUserCart(currentUser: IUserPayload) {
        const userCart = await prisma.cart.findFirst({
            where: {
                userId: currentUser.id,
            },
            include: {
                cartItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!userCart) {
            throw new NotFoundException('Your cart is empty');
        }

        return userCart;
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

    public async getCartItems(cartId: number) {
        const cartItems = await prisma.cartItem.findMany({
            where: {
                cartId,
            },
        });
        return cartItems;
    }

    private async updateCart(cartId: number) {
        const currentCartItems = await this.getCartItems(cartId);

        // Delete cart if cart is empty
        if (currentCartItems.length < 1) {
            await prisma.cart.delete({ where: { id: cartId } });
            return null;
        }
        const totalPrice = currentCartItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        const updatedCart = await prisma.cart.update({
            where: {
                id: cartId,
            },
            data: {
                totalPrice: totalPrice,
            },
        });

        return updatedCart;
    }
}

export const cartService: CartService = new CartService();
