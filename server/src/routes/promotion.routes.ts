import { Router } from 'express';
import { getAllPromotions, createPromotion, validatePromoCode } from '../controllers/promotion.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { promotionSchema } from '../utils/reviewPromosValidators';

const router = Router();

router.post('/validate/:code', authenticate, validatePromoCode);

// Admin only routes
router.use(authenticate, authorize('admin'));
router.get('/', getAllPromotions);
router.post('/', validateRequest(promotionSchema), createPromotion);

export default router;
