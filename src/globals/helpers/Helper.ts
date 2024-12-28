import { Coupon, Product } from '@prisma/client';
import { ForbiddenException } from '../middleware/error.middleware';

export class Helper {
    public static checkPermissionForProduct(
        product: Product,
        currentUser: IUserPayload
    ) {
        if (currentUser.role === 'ADMIN') return;
        if (currentUser.id === product.shopId) return;

        throw new ForbiddenException('Forbidden request');
    }

    public static checkPermission<EntityType extends { [key: string]: any }>(
        entity: EntityType,
        entityProperty: string,
        currentUser: IUserPayload
    ) {
        if (currentUser.role === 'ADMIN') return;
        if (currentUser.id === entity[entityProperty]) return;

        throw new ForbiddenException('Forbidden request');
    }

    public static getDiscountPrice(coupon: Coupon, totalOrderPrice: number) {
        let discount: number = 0;
        if (coupon.discountType === 'PERCENT') {
            discount = totalOrderPrice * (coupon.discountPrice / 100);
        } else if (coupon.discountType === 'VALUE') {
            discount = coupon.discountPrice;
        }
        return discount;
    }
}
