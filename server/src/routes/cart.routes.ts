import { Router } from 'express';
import { getCart, addToCart, clearCart } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/clear', clearCart);

export default router;
