import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { productImagesService } from '~/services/db/product-images.service';

class ProductImagesController {
    public async addImages(req: Request, res: Response) {
        const productId = parseInt(req.params.productId);

        const files = req.files as Express.Multer.File[];
        const result = await productImagesService.addProductImages(
            productId,
            files,
            req.currentUser
        );

        res.status(HTTP_STATUS.CREATED).json({
            message: `${result.count} images uploaded for product id ${productId}`,
        });
    }

    public async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        await productImagesService.deleteProductImage(id, req.currentUser);

        res.status(HTTP_STATUS.OK).json({
            message: 'Image deleted successfully',
        });
    }
}

export const productImagesController: ProductImagesController =
    new ProductImagesController();
