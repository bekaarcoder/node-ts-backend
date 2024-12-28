import express from 'express';
import { reviewController } from '../controller/review.controller';
import { verifyUser } from '~/globals/middleware/auth.middleware';
import { validateSchema } from '~/globals/middleware/validate.middleware';
import { createReviewSchema } from '../schema/review.schema';

const reviewRoute = express.Router();

reviewRoute.post(
    '/:productId',
    verifyUser,
    validateSchema(createReviewSchema),
    reviewController.addReview
);

reviewRoute.put(
    '/:reviewId',
    verifyUser,
    validateSchema(createReviewSchema),
    reviewController.updateReview
);

reviewRoute.delete('/:reviewId', verifyUser, reviewController.deleteReview);

reviewRoute.get('/:productId', reviewController.getAverageRating);

export default reviewRoute;
