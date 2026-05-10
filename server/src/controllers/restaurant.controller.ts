import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { Restaurant } from '../models/Restaurant';

export const getAllRestaurants = catchAsync(async (req: Request, res: Response) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach(el => delete queryObj[el]);

  let query = Restaurant.find(queryObj);

  // Search
  if (req.query.search) {
    query = query.find({ $text: { $search: req.query.search as string } });
  }

  // Sort
  if (req.query.sort) {
    const sortBy = (req.query.sort as string).split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const restaurants = await query;
  const total = await Restaurant.countDocuments(queryObj);

  res.status(200).json({
    success: true,
    count: restaurants.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: restaurants,
  });
});

export const getRestaurant = catchAsync(async (req: Request, res: Response) => {
  const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name profilePicture');
  
  if (!restaurant) {
    throw new AppError('Restaurant not found', 404);
  }

  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

export const createRestaurant = catchAsync(async (req: Request, res: Response) => {
  // Add user to req.body
  req.body.owner = req.user?.id;

  const existingRestaurant = await Restaurant.findOne({ owner: req.user?.id });
  if (existingRestaurant && req.user?.role !== 'admin') {
    throw new AppError('A chef can only have one restaurant', 400);
  }

  const restaurant = await Restaurant.create(req.body);

  res.status(201).json({
    success: true,
    data: restaurant,
  });
});

export const updateRestaurant = catchAsync(async (req: Request, res: Response) => {
  let restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    throw new AppError('Restaurant not found', 404);
  }

  // Ensure user is owner or admin
  if (restaurant.owner.toString() !== req.user?.id && req.user?.role !== 'admin') {
    throw new AppError('Not authorized to update this restaurant', 403);
  }

  restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: restaurant,
  });
});
