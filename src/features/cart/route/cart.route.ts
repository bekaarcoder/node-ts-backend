import express from 'express';
import { verifyUser } from '~/globals/middleware/auth.middleware';
import { cartController } from '../controller/cart.controller';

const cartRoute = express.Router();

cartRoute.post('/', verifyUser, cartController.addToCart);

export default cartRoute;
