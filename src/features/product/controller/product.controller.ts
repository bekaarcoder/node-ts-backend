import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { productService } from '~/services/db/product.service';

class ProductController {
    public async create(req: Request, res: Response) {
        const product = await productService.addProduct(req.body);

        res.status(HTTP_STATUS.CREATED).json(product);
    }

    public async read(req: Request, res: Response) {
        const products = await productService.getAllProducts();

        res.status(HTTP_STATUS.OK).json(products);
    }

    public async readSingle(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const product = await productService.getById(id);

        res.status(HTTP_STATUS.OK).json(product);
    }

    public async update(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const product = await productService.updateProduct(id, req.body);

        res.status(HTTP_STATUS.OK).json(product);
    }

    public async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        await productService.deleteProduct(id);

        res.status(HTTP_STATUS.OK).json({
            message: `Product with id ${id} deleted successfully`,
        });
    }
}

export const productController: ProductController = new ProductController();
