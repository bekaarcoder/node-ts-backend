import { prisma } from '~/prisma';
import { cartService } from './cart.service';
import { couponService } from './coupon.service';
import { Helper } from '~/globals/helpers/Helper';

class OrderService {
    public async add(requestBody: any, currentUser: IUserPayload) {
        const { addressId, couponCode } = requestBody;

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
                addressId: addressId,
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
}

export const orderService: OrderService = new OrderService();
