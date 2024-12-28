import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { reviewService } from '~/services/db/review.service';

class ReviewController {
    public async addReview(req: Request, res: Response) {
        const productId = parseInt(req.params.productId);
        const review = await reviewService.add(
            productId,
            req.body,
            req.currentUser
        );

        res.status(HTTP_STATUS.CREATED).json(review);
    }

    public async updateReview(req: Request, res: Response) {
        const reviewId = parseInt(req.params.reviewId);
        const updatedReview = await reviewService.update(
            reviewId,
            req.body,
            req.currentUser
        );

        res.status(HTTP_STATUS.OK).json(updatedReview);
    }

    public async deleteReview(req: Request, res: Response) {
        const reviewId = parseInt(req.params.reviewId);
        await reviewService.delete(reviewId, req.currentUser);

        res.status(HTTP_STATUS.OK).json({
            message: 'Review deleted successfully',
        });
    }

    public async getAverageRating(req: Request, res: Response) {
        const productId = parseInt(req.params.productId);
        const avgRating = await reviewService.getAverageRating(productId);

        res.status(HTTP_STATUS.OK).json({ average: avgRating });
    }
}

export const reviewController: ReviewController = new ReviewController();
