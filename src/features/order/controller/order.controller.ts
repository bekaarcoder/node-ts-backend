import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { orderService } from '~/services/db/order.service';

class OrderController {
    public async createOrder(req: Request, res: Response) {
        const { order, orderedItems } = await orderService.add(
            req.body,
            req.currentUser
        );

        res.status(HTTP_STATUS.CREATED).json({ order, orderedItems });
    }

    public async updateOrderStatus(req: Request, res: Response) {
        const orderId = parseInt(req.params.id);
        const updatedOrder = await orderService.updateStatus(orderId, req.body);

        res.status(HTTP_STATUS.OK).json(updatedOrder);
    }

    public async getMyOrders(req: Request, res: Response) {
        const orders = await orderService.getAll(req.currentUser);

        res.status(HTTP_STATUS.OK).json(orders);
    }

    public async getMyOrder(req: Request, res: Response) {
        const orderId = parseInt(req.params.id);
        const order = await orderService.getOne(orderId, req.currentUser);

        res.status(HTTP_STATUS.OK).json(order);
    }

    public async getAllOrders(req: Request, res: Response) {
        const orders = await orderService.getAllOrders();

        res.status(HTTP_STATUS.OK).json(orders);
    }
}

export const orderController: OrderController = new OrderController();
