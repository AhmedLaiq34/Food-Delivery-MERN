import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { Promotion } from '../models/Promotion';

export const getAllPromotions = catchAsync(async (req: Request, res: Response) => {
  const promotions = await Promotion.find();
  res.status(200).json({
    success: true,
    count: promotions.length,
    data: promotions,
  });
});

export const createPromotion = catchAsync(async (req: Request, res: Response) => {
  const promotion = await Promotion.create(req.body);
  res.status(201).json({
    success: true,
    data: promotion,
  });
});

export const validatePromoCode = catchAsync(async (req: Request, res: Response) => {
  const code = req.params.code as string;
  const { orderAmount } = req.body;

  const promotion = await Promotion.findOne({ code: code.toUpperCase() });

  if (!promotion) throw new AppError('Invalid promotion code', 404);
  if (!promotion.isActive) throw new AppError('Promotion is no longer active', 400);
  if (new Date() > promotion.expiryDate) throw new AppError('Promotion has expired', 400);
  if (promotion.maxUsage > 0 && promotion.currentUsage >= promotion.maxUsage) {
    throw new AppError('Promotion usage limit reached', 400);
  }
  if (orderAmount < promotion.minOrderAmount) {
    throw new AppError(`Minimum order amount for this promo is $${promotion.minOrderAmount}`, 400);
  }

  res.status(200).json({
    success: true,
    data: promotion,
  });
});
