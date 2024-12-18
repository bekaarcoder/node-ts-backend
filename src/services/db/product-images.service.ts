import { prisma } from '~/prisma';
import { productService } from './product.service';
import { NotFoundException } from '~/globals/middleware/error.middleware';
import { Helper } from '~/globals/helpers/Helper';

class ProductImagesService {
    public async addProductImages(
        productId: number,
        files: Express.Multer.File[],
        user: IUserPayload
    ) {
        const product = await productService.getById(productId);

        Helper.checkPermissionForProduct(product, user);

        const productImages = files.map((file) => ({
            image: file.filename,
            productId: product.id,
        }));

        const uploadedImages = await prisma.productImages.createMany({
            data: productImages,
        });

        return uploadedImages;
    }

    public async deleteProductImage(id: number, user: IUserPayload) {
        const image = await this.getImageById(id);

        const product = await productService.getById(image.productId);
        Helper.checkPermissionForProduct(product, user);

        await prisma.productImages.delete({
            where: {
                id: image.id,
            },
        });
    }

    public async getImageById(id: number) {
        const image = await prisma.productImages.findFirst({
            where: {
                id,
            },
        });

        if (!image) {
            throw new NotFoundException(
                `Product image not found with id ${id}`
            );
        }

        return image;
    }
}

export const productImagesService: ProductImagesService =
    new ProductImagesService();
