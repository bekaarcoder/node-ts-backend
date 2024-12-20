import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { productVariantItemService } from '~/services/db/product-variant-item.service';

class ProductVariantItemsController {
    public async addVariantItem(req: Request, res: Response) {
        const productId = parseInt(req.params.productId);
        const variantId = parseInt(req.params.variantId);

        const variantItem = await productVariantItemService.add(
            productId,
            variantId,
            req.body,
            req.currentUser
        );

        res.status(HTTP_STATUS.CREATED).json(variantItem);
    }

    public async deleteVariantItem(req: Request, res: Response) {
        const productId = parseInt(req.params.productId);
        const variantId = parseInt(req.params.variantId);
        const variantItemId = parseInt(req.params.variantItemId);

        await productVariantItemService.remove(
            productId,
            variantId,
            variantItemId,
            req.currentUser
        );

        res.status(HTTP_STATUS.OK).json({
            message: 'Product Variant Item deleted successfully',
        });
    }
}

export const productVariantItemsController: ProductVariantItemsController =
    new ProductVariantItemsController();
