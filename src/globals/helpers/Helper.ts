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

    public static checkPermission<EntityType extends { [key: string]: any }>(
        entity: EntityType,
        entityProperty: string,
        currentUser: IUserPayload
    ) {
        if (currentUser.role === 'ADMIN') return;
        if (currentUser.id === entity[entityProperty]) return;

        throw new ForbiddenException('Forbidden request');
    }
}
