import { Category } from '@prisma/client';
import { ICategoryBody } from '~/features/category/interface/category.interface';
import { NotFoundException } from '~/globals/middleware/error.middleware';
import { prisma } from '~/prisma';

class CategoryService {
    public async add(requestBody: ICategoryBody): Promise<Category> {
        const { name, icon } = requestBody;
        const category: Category = await prisma.category.create({
            data: {
                name,
                icon,
            },
        });
        return category;
    }

    public async getAll(): Promise<Category[]> {
        const categories: Category[] = await prisma.category.findMany();
        return categories;
    }

    public async getCategoryById(id: number): Promise<Category> {
        const category: Category | null = await prisma.category.findFirst({
            where: {
                id,
            },
        });

        if (!category) {
            throw new NotFoundException(
                `Category cannot be found with id: ${id} `
            );
        }

        return category;
    }

    public async updateCategory(id: number, requestBody: ICategoryBody) {
        const category: Category = await this.getCategoryById(id);
        const { name, icon } = requestBody;

        const updatedCategory = await prisma.category.update({
            where: {
                id: category.id,
            },
            data: {
                name,
                icon,
            },
        });

        return updatedCategory;
    }

    public async deleteCategory(id: number): Promise<void> {
        const category: Category = await this.getCategoryById(id);
        await prisma.category.delete({
            where: {
                id: category.id,
            },
        });
    }
}

export const categoryService: CategoryService = new CategoryService();
