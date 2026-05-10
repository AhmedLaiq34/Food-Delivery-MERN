import { Router } from 'express';
import { getReviews, createReview, replyToReview } from '../controllers/review.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { reviewSchema, replyReviewSchema } from '../utils/reviewPromosValidators';

const router = Router();

router.get('/:targetId', getReviews);

router.use(authenticate);
router.post('/', validateRequest(reviewSchema), createReview);
router.put('/:id/reply', authorize('chef', 'admin'), validateRequest(replyReviewSchema), replyToReview);

export default router;
