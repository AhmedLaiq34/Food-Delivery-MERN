import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { User } from '../models/User';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user?.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

export const addAddress = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);
  if (!user) throw new AppError('User not found', 404);

  if (req.body.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  } else if (user.addresses.length === 0) {
    req.body.isDefault = true;
  }

  user.addresses.push(req.body);
  await user.save();

  res.status(200).json({
    success: true,
    data: user.addresses,
  });
});

export const toggleFavourite = catchAsync(async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const user = await User.findById(req.user?.id);
  
  if (!user) throw new AppError('User not found', 404);

  const index = user.favourites.indexOf(restaurantId as any);
  if (index > -1) {
    user.favourites.splice(index, 1);
  } else {
    user.favourites.push(restaurantId as any);
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user.favourites,
  });
});
