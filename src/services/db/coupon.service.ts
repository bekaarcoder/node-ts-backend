import {
    ICouponBody,
    ICouponUpdateBody,
} from '~/features/coupon/interface/coupon.interface';
import {
    BadRequestException,
    NotFoundException,
} from '~/globals/middleware/error.middleware';
import { prisma } from '~/prisma';

class CouponService {
    public async add(requestBody: ICouponBody) {
        const { code, discountPrice, discountType, isActive } = requestBody;

        const existingCoupon = await this.getCoupon(code);

        if (existingCoupon) {
            throw new BadRequestException('Coupon code already exist');
        }

        const coupon = await prisma.coupon.create({
            data: {
                code,
                discountPrice,
                discountType,
                isActive,
            },
        });

        return coupon;
    }

    public async update(code: string, requestBody: ICouponUpdateBody) {
        const coupon = await this.getOne(code);

        const { discountPrice, discountType, isActive } = requestBody;

        const updatedCoupon = await prisma.coupon.update({
            where: {
                code: coupon.code,
            },
            data: {
                discountPrice,
                discountType,
                isActive,
            },
        });

        return updatedCoupon;
    }

    public async getAll() {
        const coupons = await prisma.coupon.findMany();

        return coupons;
    }

    public async getOne(code: string) {
        const coupon = await this.getCoupon(code);

        if (!coupon) {
            throw new NotFoundException(`Coupon not found with code ${code}`);
        }

        return coupon;
    }

    public async getCoupon(code: string) {
        const coupon = await prisma.coupon.findFirst({
            where: {
                code,
            },
        });

        return coupon;
    }
}

export const couponService: CouponService = new CouponService();
