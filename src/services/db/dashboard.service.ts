import { prisma } from '~/prisma';

class DashboardService {
    public async getInfo() {
        const productsCount = await prisma.product.count();

        const usersCount = await prisma.user.count({
            where: {
                isActive: true,
            },
        });

        const totalRevenue = await prisma.order.aggregate({
            _sum: {
                totalPrice: true,
            },
        });

        // Revenue for each product
        const totalRevenueByProduct = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                price: true,
                quantity: true,
            },
        });

        const revenueByProducts = totalRevenueByProduct.map((item) => ({
            productId: item.productId,
            totalRevenue: (item._sum.price || 0) * (item._sum.quantity || 0),
        }));

        return {
            productsCount,
            usersCount,
            totalRevenue: totalRevenue._sum.totalPrice,
            totalRevenueByProduct: revenueByProducts,
        };
    }
}

export const dashboardService: DashboardService = new DashboardService();
