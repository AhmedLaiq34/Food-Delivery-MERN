import { Router } from 'express';
import { getMenuItemsByRestaurant, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menu.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { menuItemSchema } from '../utils/apiValidators';

// Support mergeParams so we can use /api/restaurants/:restaurantId/menu
const router = Router({ mergeParams: true });

router.get('/', getMenuItemsByRestaurant);

// Protected Chef/Admin routes
router.use(authenticate);
router.use(authorize('chef', 'admin'));

router.post('/', validateRequest(menuItemSchema), createMenuItem);
router.put('/:id', validateRequest(menuItemSchema), updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;
