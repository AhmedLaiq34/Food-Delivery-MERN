import { Router } from 'express';
import { placeOrder, getMyOrders, getOrderById, getRestaurantOrders, updateOrderStatus } from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { orderSchema, updateOrderStatusSchema } from '../utils/orderValidators';

const router = Router();

router.use(authenticate);

// Customer routes
router.post('/', validateRequest(orderSchema), placeOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);

// Chef / Admin routes
router.get('/restaurant/:restaurantId', authorize('chef', 'admin'), getRestaurantOrders);
router.put('/:id/status', authorize('chef', 'admin'), validateRequest(updateOrderStatusSchema), updateOrderStatus);

export default router;
