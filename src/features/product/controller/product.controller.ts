import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { Utils } from '~/globals/constants/utils';
import { productService } from '~/services/db/product.service';

class ProductController {
    public async create(req: Request, res: Response) {
        console.log(req.file);
        const product = await productService.addProduct(
            req.body,
            req.currentUser.id,
            req.file
        );

        res.status(HTTP_STATUS.CREATED).json(product);
    }

    public async read(req: Request, res: Response) {
        // const products = await productService.getAllProducts();

        // Pagination
        const page = parseInt(req.query.page as string) || Utils.DEFAULT_PAGE;
        const pageSize =
            parseInt(req.query.pageSize as string) || Utils.DEFAULT_PAGE_SIZE;

        // Sorting
        const sortBy = (req.query.sortBy as string) || Utils.DEFAULT_SORT_BY;
        const sortDir = (req.query.sortDir as string) || Utils.DEFAULT_SORT_DIR;

        // Filtering
        const filterColumn = req.query.filterColumn as string;
        const filterValue = req.query.filterValue as string;

        let where: any = {};
        const operations = ['lt', 'lte', 'gt', 'gte', 'equals'];

        if (filterColumn && filterValue) {
            const [condition, value] = filterValue.split('.');
            operations.forEach((op) => {
                if (op === condition) {
                    where[filterColumn] = where[filterColumn] || {};
                    where[filterColumn][condition] = parseInt(value);
                }
            });
        }

        const products = await productService.getWithPagination(
            page,
            pageSize,
            sortBy,
            sortDir,
            where
        );

        res.status(HTTP_STATUS.OK).json(products);
    }

    public async readSingle(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const product = await productService.getById(id);

        res.status(HTTP_STATUS.OK).json(product);
    }

    public async update(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const product = await productService.updateProduct(
            id,
            req.currentUser,
            req.body,
            req.file
        );

        res.status(HTTP_STATUS.OK).json(product);
    }

    public async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        await productService.deleteProduct(id, req.currentUser);

        res.status(HTTP_STATUS.OK).json({
            message: `Product with id ${id} deleted successfully`,
        });
    }
}

export const productController: ProductController = new ProductController();
