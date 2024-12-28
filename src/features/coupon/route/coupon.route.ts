import express from 'express';
import {
    authorizeRoles,
    verifyUser,
} from '~/globals/middleware/auth.middleware';
import { couponController } from '../controller/coupon.controller';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import {
    createCouponSchema,
    updateCouponSchema,
} from '../schema/coupon.schema';

const couponRoute = express.Router();

couponRoute.post(
    '/',
    verifyUser,
    authorizeRoles('ADMIN'),
    validateSchema(createCouponSchema),
    couponController.createCoupon
);

couponRoute.get(
    '/',
    verifyUser,
    authorizeRoles('ADMIN'),
    couponController.getAllCoupons
);

couponRoute.get('/:code', couponController.getCoupon);

couponRoute.put(
    '/:code',
    verifyUser,
    authorizeRoles('ADMIN'),
    validateSchema(updateCouponSchema),
    couponController.updateCoupon
);

export default couponRoute;
