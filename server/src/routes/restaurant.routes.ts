import { Router } from 'express';
import { getAllRestaurants, getRestaurant, createRestaurant, updateRestaurant } from '../controllers/restaurant.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { restaurantSchema } from '../utils/apiValidators';

const router = Router();

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurant);

// Protected routes (Chef & Admin)
router.use(authenticate);
router.post('/', authorize('chef', 'admin'), validateRequest(restaurantSchema), createRestaurant);
router.put('/:id', authorize('chef', 'admin'), validateRequest(restaurantSchema), updateRestaurant);

export default router;
