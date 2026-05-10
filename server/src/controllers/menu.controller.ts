import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { MenuItem } from '../models/MenuItem';
import { Restaurant } from '../models/Restaurant';

export const getMenuItemsByRestaurant = catchAsync(async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const menuItems = await MenuItem.find({ restaurant: restaurantId });

  res.status(200).json({
    success: true,
    count: menuItems.length,
    data: menuItems,
  });
});

export const createMenuItem = catchAsync(async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  
  // Verify restaurant belongs to the user (if chef)
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new AppError('Restaurant not found', 404);
  }

  if (restaurant.owner.toString() !== req.user?.id && req.user?.role !== 'admin') {
    throw new AppError('Not authorized to add menu items to this restaurant', 403);
  }

  req.body.restaurant = restaurantId;
  const menuItem = await MenuItem.create(req.body);

  res.status(201).json({
    success: true,
    data: menuItem,
  });
});

export const updateMenuItem = catchAsync(async (req: Request, res: Response) => {
  let menuItem = await MenuItem.findById(req.params.id).populate('restaurant');
  
  if (!menuItem) {
    throw new AppError('Menu item not found', 404);
  }

  const restaurant = menuItem.restaurant as any;
  if (restaurant.owner.toString() !== req.user?.id && req.user?.role !== 'admin') {
    throw new AppError('Not authorized to update this menu item', 403);
  }

  menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: menuItem,
  });
});

export const deleteMenuItem = catchAsync(async (req: Request, res: Response) => {
  const menuItem = await MenuItem.findById(req.params.id).populate('restaurant');
  
  if (!menuItem) {
    throw new AppError('Menu item not found', 404);
  }

  const restaurant = menuItem.restaurant as any;
  if (restaurant.owner.toString() !== req.user?.id && req.user?.role !== 'admin') {
    throw new AppError('Not authorized to delete this menu item', 403);
  }

  await MenuItem.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
