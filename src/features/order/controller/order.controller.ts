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
}

export const orderController: OrderController = new OrderController();
