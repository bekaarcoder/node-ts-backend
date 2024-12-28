import {
    ForbiddenException,
    NotFoundException,
} from '~/globals/middleware/error.middleware';
import { orderService } from './order.service';
import { productService } from './product.service';
import { prisma } from '~/prisma';
import { Helper } from '~/globals/helpers/Helper';
import { IReviewBody } from '~/features/review/interface/review.interface';

class ReviewService {
    public async add(
        productId: number,
        requestBody: IReviewBody,
        currentUser: IUserPayload
    ) {
        const { rating, comment } = requestBody;
        const product = await productService.getById(productId);

        // Check if user has already reviewed this product
        const reviews = await this.getAll(currentUser);
        const existingReview = reviews.find(
            (review) => review.productId === product.id
        );
        if (existingReview) {
            throw new ForbiddenException(
                'You already added a review for this product'
            );
        }

        // Check if user has purchased this product.
        // If yes, then only user can add a review
        const orders = await orderService.getAll(currentUser);
        const orderItems = orders.map((order) => order.orderItems).flat();

        const item = orderItems.find((item) => item.productId === product.id);
        if (!item) {
            throw new ForbiddenException(
                'You are not allowed to review this product'
            );
        }

        const review = await prisma.review.create({
            data: {
                productId,
                comment,
                rating,
                userId: currentUser.id,
            },
        });

        return review;
    }

    public async update(
        reviewId: number,
        requestBody: IReviewBody,
        currentUser: IUserPayload
    ) {
        const { rating, comment } = requestBody;

        const review = await this.getById(reviewId);
        Helper.checkPermission(review, 'userId', currentUser);

        const updatedReview = await prisma.review.update({
            where: {
                id: review.id,
            },
            data: {
                comment,
                rating,
            },
        });

        return updatedReview;
    }

    public async delete(reviewId: number, currentUser: IUserPayload) {
        const review = await this.getById(reviewId);
        Helper.checkPermission(review, 'userId', currentUser);

        await prisma.review.delete({
            where: {
                id: reviewId,
            },
        });
    }

    public async getAverageRating(productId: number) {
        const product = await productService.getById(productId);
        const aggregations = await prisma.review.aggregate({
            _avg: {
                rating: true,
            },
            where: {
                productId: product.id,
            },
        });

        return aggregations._avg.rating;
    }

    public async getAll(currentUser: IUserPayload) {
        const reviews = await prisma.review.findMany({
            where: {
                userId: currentUser.id,
            },
        });

        return reviews;
    }

    public async getById(reviewId: number) {
        const review = await prisma.review.findFirst({
            where: {
                id: reviewId,
            },
        });

        if (!review) {
            throw new NotFoundException(`Review not found with id ${reviewId}`);
        }

        return review;
    }
}

export const reviewService: ReviewService = new ReviewService();
