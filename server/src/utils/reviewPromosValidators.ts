import { z } from 'zod';

export const reviewSchema = z.object({
  body: z.object({
    targetType: z.enum(['restaurant', 'menuItem']),
    target: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(3),
  }),
});

export const replyReviewSchema = z.object({
  body: z.object({
    reply: z.string().min(3),
  }),
});

export const promotionSchema = z.object({
  body: z.object({
    code: z.string().min(3).toUpperCase(),
    discountType: z.enum(['percentage', 'fixed']),
    discountAmount: z.number().positive(),
    minOrderAmount: z.number().min(0).optional(),
    maxUsage: z.number().min(0).optional(),
    expiryDate: z.string(), // ISO date string
    isActive: z.boolean().optional(),
  }),
});
