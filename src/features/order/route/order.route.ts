import express from 'express';
import {
    authorizeRoles,
    verifyUser,
} from '~/globals/middleware/auth.middleware';
import { orderController } from '../controller/order.controller';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { UpdateOrderStatusSchema } from '../schema/order.schema';

const orderRoute = express.Router();

orderRoute.post('/', verifyUser, orderController.createOrder);

orderRoute.put(
    '/:id',
    verifyUser,
    authorizeRoles('ADMIN'),
    validateSchema(UpdateOrderStatusSchema),
    orderController.updateOrderStatus
);

orderRoute.get('/', verifyUser, orderController.getMyOrders);

orderRoute.get(
    '/all',
    verifyUser,
    authorizeRoles('ADMIN'),
    orderController.getAllOrders
);

orderRoute.get('/:id', verifyUser, orderController.getMyOrder);

export default orderRoute;
