import { z } from 'zod';

export const orderSchema = z.object({
  body: z.object({
    restaurantId: z.string(),
    deliveryAddress: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      zipCode: z.string().min(1),
      country: z.string().min(1),
    }),
    paymentMethod: z.enum(['cod', 'stripe']),
    promoCode: z.string().optional(),
    isDelivery: z.boolean().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'payment_failed']),
  }),
});
