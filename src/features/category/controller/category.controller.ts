import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { categoryService } from '~/services/db/category.service';

class CategoryController {
    public async create(req: Request, res: Response, next: NextFunction) {
        const category = await categoryService.add(req.body);

        res.status(HTTP_STATUS.CREATED).json(category);
    }

    public async getAll(req: Request, res: Response) {
        const categories = await categoryService.getAll();
        res.status(HTTP_STATUS.OK).json(categories);
    }

    public async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const category = await categoryService.getCategoryById(id);

        res.status(HTTP_STATUS.OK).json(category);
    }

    public async update(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const category = await categoryService.updateCategory(id, req.body);

        res.status(HTTP_STATUS.OK).json(category);
    }

    public async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        await categoryService.deleteCategory(id);

        res.status(HTTP_STATUS.OK).json({
            message: 'Category deleted successfully',
        });
    }
}

export const categoryController: CategoryController = new CategoryController();
