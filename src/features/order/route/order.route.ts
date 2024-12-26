import express from 'express';
import { verifyUser } from '~/globals/middleware/auth.middleware';
import { orderController } from '../controller/order.controller';

const orderRoute = express.Router();

orderRoute.post('/', verifyUser, orderController.createOrder);

export default orderRoute;
