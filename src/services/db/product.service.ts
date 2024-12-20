import { Product } from '@prisma/client';
import { Express } from 'express';
import { IProductBody } from '~/features/product/interface/product.interface';
import { Utils } from '~/globals/constants/utils';
import { Helper } from '~/globals/helpers/Helper';
import {
    ForbiddenException,
    NotFoundException,
} from '~/globals/middleware/error.middleware';
import { prisma } from '~/prisma';

class ProductService {
    public async addProduct(
        requestBody: IProductBody,
        userId: number,
        file: Express.Multer.File | undefined
    ) {
        const {
            name,
            shortDescription,
            longDescription,
            quantity,
            price,
            categoryId,
        } = requestBody;

        const product: Product = await prisma.product.create({
            data: {
                name,
                shortDescription,
                longDescription,
                quantity: parseInt(quantity),
                price: parseFloat(price),
                mainImage: file?.filename ? file.filename : '',
                categoryId: parseInt(categoryId),
                shopId: userId,
            },
        });
        return product;
    }

    public async getWithPagination(
        page: number = Utils.DEFAULT_PAGE,
        pageSize: number = Utils.DEFAULT_PAGE_SIZE,
        sortBy: string = Utils.DEFAULT_SORT_BY,
        sortDir: string = Utils.DEFAULT_SORT_DIR,
        filterObj: any = {}
    ) {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const products: Product[] = await prisma.product.findMany({
            skip,
            take,
            where: filterObj,
            orderBy: {
                [sortBy]: sortDir,
            },
        });

        return products;
    }

    public async getAllProducts() {
        const products: Product[] = await prisma.product.findMany();

        return products;
    }

    public async getById(id: number) {
        const product = await prisma.product.findFirst({
            where: {
                id,
            },
            include: {
                productImages: true,
                productVariants: {
                    include: {
                        productVariantItems: true,
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException(`Product not found with id: ${id}`);
        }

        return product;
    }

    public async updateProduct(
        id: number,
        user: IUserPayload,
        requestBody: IProductBody,
        file: Express.Multer.File | undefined
    ) {
        const product = await this.getById(id);

        Helper.checkPermissionForProduct(product, user);

        const {
            name,
            shortDescription,
            longDescription,
            quantity,
            price,
            categoryId,
        } = requestBody;
        const updatedProduct = await prisma.product.update({
            where: {
                id: product.id,
            },
            data: {
                name,
                shortDescription,
                longDescription,
                quantity: parseInt(quantity),
                price: parseFloat(price),
                mainImage: file?.filename ? file.filename : product.mainImage,
                categoryId: parseInt(categoryId),
                shopId: user.id,
            },
        });
        return updatedProduct;
    }

    public async deleteProduct(id: number, user: IUserPayload) {
        const product = await this.getById(id);

        Helper.checkPermissionForProduct(product, user);

        await prisma.product.delete({
            where: {
                id: product.id,
            },
        });
    }

    public async getMyProducts(currentUser: IUserPayload) {
        const userProducts = await prisma.user.findFirst({
            where: {
                id: currentUser.id,
            },
            include: {
                products: true,
            },
            omit: {
                password: true,
            },
        });
        return userProducts;
    }
}

export const productService: ProductService = new ProductService();
