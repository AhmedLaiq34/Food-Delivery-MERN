import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { Cart } from '../models/Cart';
import { MenuItem } from '../models/MenuItem';

export const getCart = catchAsync(async (req: Request, res: Response) => {
  let cart = await Cart.findOne({ user: req.user?.id }).populate('items.menuItem');

  if (!cart) {
    cart = await Cart.create({ user: req.user?.id, items: [] });
  }

  res.status(200).json({
    success: true,
    data: cart,
  });
});

export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const { menuItemId, quantity, size, toppings, specialInstructions } = req.body;

  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) {
    throw new AppError('Menu item not found', 404);
  }

  // Calculate item total (base price + toppings)
  let itemTotal = menuItem.price * quantity;
  // Note: in a real app, you would validate the size and toppings against the menuItem schema to prevent price manipulation

  let cart = await Cart.findOne({ user: req.user?.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user?.id,
      restaurant: menuItem.restaurant,
      items: [{ menuItem: menuItemId, quantity, size, toppings, specialInstructions, itemTotal }],
      subtotal: itemTotal,
      total: itemTotal
    });
  } else {
    // If cart exists, ensure it's from the same restaurant
    if (cart.restaurant.toString() !== menuItem.restaurant.toString()) {
      throw new AppError('Cannot add items from different restaurants to the same cart. Please clear your cart first.', 400);
    }

    // Check if item already exists in cart with same size and toppings
    const existingItemIndex = cart.items.findIndex(
      (item) => item.menuItem.toString() === menuItemId && item.size === size
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].itemTotal += itemTotal;
    } else {
      cart.items.push({ menuItem: menuItemId, quantity, size, toppings, specialInstructions, itemTotal });
    }

    // Update totals
    cart.subtotal += itemTotal;
    // Simplistic tax/delivery calculation for MVP
    cart.tax = cart.subtotal * 0.08; 
    cart.total = cart.subtotal + cart.tax + cart.deliveryFee - cart.discount;

    await cart.save();
  }

  await cart.populate('items.menuItem');

  res.status(200).json({
    success: true,
    data: cart,
  });
});

export const clearCart = catchAsync(async (req: Request, res: Response) => {
  await Cart.findOneAndDelete({ user: req.user?.id });

  res.status(200).json({
    success: true,
    data: {},
  });
});
