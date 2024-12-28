import { prisma } from '~/prisma';
import { cartService } from './cart.service';
import { couponService } from './coupon.service';
import { Helper } from '~/globals/helpers/Helper';
import {
    BadRequestException,
    NotFoundException,
} from '~/globals/middleware/error.middleware';
import { IOrderUpdateBody } from '~/features/order/interface/order.interface';
import { addressService } from './address.service';

class OrderService {
    public async add(requestBody: any, currentUser: IUserPayload) {
        const { addressId, couponCode } = requestBody;

        const address = await addressService.getById(addressId);
        if (address.userId !== currentUser.id) {
            throw new BadRequestException('Please select correct address');
        }

        // Get all the items in my cart
        const cart = await cartService.getUserCart(currentUser);
        const cartItems = cart.cartItems;

        // Check if couponcode exist and apply discount
        let discountAmount: number = 0;
        const coupon = await couponService.getOne(couponCode);
        discountAmount = Helper.getDiscountPrice(coupon, cart.totalPrice);

        const totalQuantity = cartItems.reduce(
            (acc, item) => acc + item.quantity,
            0
        );

        // Create a order
        const order = await prisma.order.create({
            data: {
                totalPrice: cart.totalPrice - discountAmount,
                discountPrice: discountAmount,
                addressId: address.id,
                status: 'PENDING',
                totalQuantity: totalQuantity,
                userId: currentUser.id,
            },
        });
        // Loop through the items and add to orderItem
        const orderItems = cartItems.map((item) => ({
            variant: item.variant,
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
            orderId: order.id,
        }));

        const orderedItems = await prisma.orderItem.createMany({
            data: orderItems,
        });

        // Clear cart
        await cartService.clear(cart.id, currentUser);

        return { order, orderedItems };
    }

    public async updateStatus(orderId: number, requestBody: IOrderUpdateBody) {
        const order = await this.getById(orderId);

        const { status } = requestBody;

        const updatedOrder = await prisma.order.update({
            where: {
                id: order.id,
            },
            data: {
                status,
            },
        });

        return updatedOrder;
    }

    public async getAll(currentUser: IUserPayload) {
        const orders = await prisma.order.findMany({
            where: {
                userId: currentUser.id,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return orders;
    }

    public async getOne(orderId: number, currentUser: IUserPayload) {
        const order = await this.getById(orderId);

        Helper.checkPermission(order, 'userId', currentUser);

        const myOrder = await prisma.order.findFirst({
            where: {
                id: order.id,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return myOrder;
    }

    public async getAllOrders() {
        const orders = await prisma.order.findMany({
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return orders;
    }

    public async getById(orderId: number) {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
            },
        });

        if (!order) {
            throw new NotFoundException(`Order not found with id ${orderId}`);
        }

        return order;
    }
}

export const orderService: OrderService = new OrderService();
