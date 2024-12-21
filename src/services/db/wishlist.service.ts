import { prisma } from '~/prisma';
import { productService } from './product.service';
import {
    BadRequestException,
    NotFoundException,
} from '~/globals/middleware/error.middleware';

class WishListService {
    public async add(requestBody: any, user: IUserPayload) {
        const { productId } = requestBody;

        const product = await productService.getById(productId);

        const wishlistItem = await this.getWishList(product.id, user.id);
        if (wishlistItem) {
            throw new BadRequestException(
                `Product with id ${product.id} already exists in your wishlist`
            );
        }

        await prisma.wishlist.create({
            data: {
                productId: product.id,
                userId: user.id,
            },
        });
    }

    public async remove(productId: number, user: IUserPayload) {
        const product = await productService.getById(productId);

        const wishlistItem = await this.getWishList(product.id, user.id);

        if (!wishlistItem) {
            throw new NotFoundException(
                `Product with id ${product.id} not found in your wishlist`
            );
        }

        await prisma.wishlist.delete({
            where: {
                userId_productId: {
                    productId: product.id,
                    userId: user.id,
                },
            },
        });
    }

    public async getWishlistItems(user: IUserPayload) {
        const wishlistItems = await prisma.wishlist.findMany({
            where: {
                userId: user.id,
            },
            include: {
                product: true,
            },
        });

        return wishlistItems;
    }

    private async getWishList(productId: number, userId: number) {
        const wishlistItem = await prisma.wishlist.findFirst({
            where: {
                productId,
                userId,
            },
        });
        return wishlistItem;
    }
}

export const wishListService: WishListService = new WishListService();
