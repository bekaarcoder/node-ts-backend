import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { couponService } from '~/services/db/coupon.service';

class CouponController {
    public async createCoupon(req: Request, res: Response) {
        const coupon = await couponService.add(req.body);

        res.status(HTTP_STATUS.CREATED).json(coupon);
    }

    public async getAllCoupons(req: Request, res: Response) {
        const coupons = await couponService.getAll();

        res.status(HTTP_STATUS.OK).json(coupons);
    }

    public async getCoupon(req: Request, res: Response) {
        const coupon = await couponService.getOne(req.params.code);

        res.status(HTTP_STATUS.OK).json(coupon);
    }

    public async updateCoupon(req: Request, res: Response) {
        const updatedCoupon = await couponService.update(
            req.params.code,
            req.body
        );

        res.status(HTTP_STATUS.OK).json(updatedCoupon);
    }
}

export const couponController: CouponController = new CouponController();
