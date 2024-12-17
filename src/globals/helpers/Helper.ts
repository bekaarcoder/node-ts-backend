import { Product } from '@prisma/client';
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
}
