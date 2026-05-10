import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { Review } from '../models/Review';
import { Restaurant } from '../models/Restaurant';

export const getReviews = catchAsync(async (req: Request, res: Response) => {
  const { targetId } = req.params;
  const reviews = await Review.find({ target: targetId }).populate('user', 'name profilePicture');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

export const createReview = catchAsync(async (req: Request, res: Response) => {
  const { targetType, target, rating, comment } = req.body;

  // Ensure user hasn't already reviewed this item
  const existingReview = await Review.findOne({ user: req.user?.id, target });
  if (existingReview) {
    throw new AppError('You have already reviewed this item', 400);
  }

  const review = await Review.create({
    user: req.user?.id,
    targetType,
    target,
    rating,
    comment,
  });

  // Calculate new average rating
  const stats = await Review.aggregate([
    { $match: { target: review.target } },
    { $group: { _id: '$target', avgRating: { $avg: '$rating' }, nRatings: { $sum: 1 } } }
  ]);

  if (targetType === 'restaurant') {
    await Restaurant.findByIdAndUpdate(target, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].nRatings
    });
  }
  // Similar logic for menuItem if needed...

  res.status(201).json({
    success: true,
    data: review,
  });
});

export const replyToReview = catchAsync(async (req: Request, res: Response) => {
  const { reply } = req.body;
  const review = await Review.findById(req.params.id);

  if (!review) throw new AppError('Review not found', 404);

  // Authorize: only chef/owner of the target restaurant or admin can reply
  let isAuthorized = false;
  if (req.user?.role === 'admin') {
    isAuthorized = true;
  } else if (review.targetType === 'restaurant') {
    const restaurant = await Restaurant.findById(review.target);
    if (restaurant && restaurant.owner.toString() === req.user?.id) isAuthorized = true;
  }

  if (!isAuthorized) throw new AppError('Not authorized', 403);

  review.reply = reply;
  review.repliedAt = new Date();
  await review.save();

  res.status(200).json({
    success: true,
    data: review,
  });
});
