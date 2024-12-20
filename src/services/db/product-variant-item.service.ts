import { prisma } from '~/prisma';
import { productService } from './product.service';
import { Helper } from '~/globals/helpers/Helper';
import { productVariantService } from './product-variant.service';
import { NotFoundException } from '~/globals/middleware/error.middleware';

class ProductVariantItemService {
    public async add(
        productId: number,
        variantId: number,
        requestBody: any,
        user: IUserPayload
    ) {
        const { name } = requestBody;

        const product = await productService.getById(productId);
        Helper.checkPermissionForProduct(product, user);

        const productVariant = await productVariantService.getById(variantId);

        const variantItem = await prisma.productVariantItem.create({
            data: {
                name,
                productVariantId: productVariant.id,
            },
        });

        return variantItem;
    }

    public async remove(
        productId: number,
        variantId: number,
        variantItemId: number,
        user: IUserPayload
    ) {
        const product = await productService.getById(productId);
        Helper.checkPermissionForProduct(product, user);

        const productVariant = await productVariantService.getById(variantId);
        const variantItem = productVariant.productVariantItems.find(
            (item) => item.id === variantItemId
        );

        if (!variantItem) {
            throw new NotFoundException(
                `Product Variant Item with id ${variantItemId} not found for product variant with id ${variantId}`
            );
        }

        await prisma.productVariantItem.delete({
            where: {
                id: variantItem.id,
            },
        });
    }
}

export const productVariantItemService: ProductVariantItemService =
    new ProductVariantItemService();
