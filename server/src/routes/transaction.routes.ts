import { Router } from 'express';
import { getMyTransactions, requestWithdrawal, getAllTransactions } from '../controllers/transaction.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Chef routes
router.get('/my-transactions', authorize('chef', 'admin'), getMyTransactions);
router.post('/withdraw', authorize('chef'), requestWithdrawal);

// Admin routes
router.get('/', authorize('admin'), getAllTransactions);

export default router;
