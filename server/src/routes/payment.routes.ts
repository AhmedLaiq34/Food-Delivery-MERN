import express, { Router } from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { createPaymentIntentSchema } from '../utils/paymentValidators';

const router = Router();

// Webhook route needs to be raw parser to verify Stripe signature
// The root index.ts skips express.json() for this route, so we apply express.raw() here
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.use(authenticate);
router.post('/create-intent', validateRequest(createPaymentIntentSchema), createPaymentIntent);

export default router;
