import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  body: z.object({
    orderId: z.string(), // We'll pass the generated Order ID that was saved as 'placed'
  }),
});
