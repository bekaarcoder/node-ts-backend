import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { productVariantService } from '~/services/db/product-variant.service';

class ProductVariantsController {
    public async addVariant(req: Request, res: Response) {
        const productId = parseInt(req.params.productId);
        const variant = await productVariantService.add(
            productId,
            req.body,
            req.currentUser
        );

        res.status(HTTP_STATUS.CREATED).json(variant);
    }

    public async deleteVariant(req: Request, res: Response) {
        const productId = parseInt(req.params.productId);
        const variantId = parseInt(req.params.variantId);

        await productVariantService.remove(
            productId,
            variantId,
            req.currentUser
        );

        res.status(HTTP_STATUS.OK).json({
            message: 'Product variant deleted successfully',
        });
    }
}

export const productVariantsController: ProductVariantsController =
    new ProductVariantsController();
