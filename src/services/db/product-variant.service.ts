import { prisma } from '~/prisma';
import { productService } from './product.service';
import { NotFoundException } from '~/globals/middleware/error.middleware';
import { Helper } from '~/globals/helpers/Helper';

class ProductVariantService {
    public async add(productId: number, requestBody: any, user: IUserPayload) {
        const product = await productService.getById(productId);

        Helper.checkPermissionForProduct(product, user);

        const { name } = requestBody;
        const variant = await prisma.productVariant.create({
            data: {
                name,
                productId: product.id,
            },
        });

        return variant;
    }

    public async remove(
        productId: number,
        variantId: number,
        user: IUserPayload
    ) {
        const product = await productService.getById(productId);

        Helper.checkPermissionForProduct(product, user);

        const variant = await this.getById(variantId);

        await prisma.productVariant.delete({
            where: {
                id: variant.id,
            },
        });
    }

    public async getById(variantId: number) {
        const variant = await prisma.productVariant.findFirst({
            where: {
                id: variantId,
            },
            include: {
                productVariantItems: true,
            },
        });

        if (!variant) {
            throw new NotFoundException(
                `Product variant not found with id ${variantId}`
            );
        }

        return variant;
    }
}

export const productVariantService: ProductVariantService =
    new ProductVariantService();
