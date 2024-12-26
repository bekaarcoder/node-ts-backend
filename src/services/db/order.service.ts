import { prisma } from '~/prisma';
import { cartService } from './cart.service';

class OrderService {
    public async add(requestBody: any, currentUser: IUserPayload) {
        const { addressId } = requestBody;

        // Get all the items in my cart
        const cart = await cartService.getUserCart(currentUser);
        const cartItems = cart.cartItems;

        const totalQuantity = cartItems.reduce(
            (acc, item) => acc + item.quantity,
            0
        );
        // Create a order
        const order = await prisma.order.create({
            data: {
                totalPrice: cart.totalPrice,
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
