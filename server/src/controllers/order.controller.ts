import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { Order } from '../models/Order';
import { Cart } from '../models/Cart';
import { Restaurant } from '../models/Restaurant';

const generateOrderId = () => {
  return `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const placeOrder = catchAsync(async (req: Request, res: Response) => {
  const { restaurantId, deliveryAddress, paymentMethod, isDelivery } = req.body;

  const cart = await Cart.findOne({ user: req.user?.id, restaurant: restaurantId });
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  const orderId = generateOrderId();

  // Create order from cart
  const order = await Order.create({
    orderId,
    customer: req.user?.id,
    restaurant: restaurantId,
    items: cart.items,
    status: paymentMethod === 'stripe' ? 'placed' : 'placed', // Would handle payment intent here usually
    subtotal: cart.subtotal,
    deliveryFee: cart.deliveryFee,
    tax: cart.tax,
    discount: cart.discount,
    total: cart.total,
    deliveryAddress,
    paymentMethod,
    isDelivery: isDelivery !== false,
  });

  // Clear cart after placing order
  await Cart.findByIdAndDelete(cart._id);

  res.status(201).json({
    success: true,
    data: order,
  });
});

export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await Order.find({ customer: req.user?.id })
    .sort('-createdAt')
    .populate('restaurant', 'name coverImage');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate('restaurant', 'name address')
    .populate('customer', 'name phone email')
    .populate('items.menuItem', 'name image');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Ensure user is authorized to view this order (customer, restaurant owner, or admin)
  let authorized = false;
  if (req.user?.role === 'admin') authorized = true;
  else if (order.customer._id.toString() === req.user?.id) authorized = true;
  else {
    const restaurant = await Restaurant.findById(order.restaurant);
    if (restaurant && restaurant.owner.toString() === req.user?.id) authorized = true;
  }

  if (!authorized) {
    throw new AppError('Not authorized to view this order', 403);
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const getRestaurantOrders = catchAsync(async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new AppError('Restaurant not found', 404);

  if (restaurant.owner.toString() !== req.user?.id && req.user?.role !== 'admin') {
    throw new AppError('Not authorized', 403);
  }

  const orders = await Order.find({ restaurant: restaurantId })
    .sort('-createdAt')
    .populate('customer', 'name phone')
    .populate('items.menuItem', 'name');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) throw new AppError('Order not found', 404);

  const restaurant = await Restaurant.findById(order.restaurant);
  if (restaurant && restaurant.owner.toString() !== req.user?.id && req.user?.role !== 'admin') {
    throw new AppError('Not authorized', 403);
  }

  order.status = status;
  await order.save();

  // Here we would emit a Socket.io event to notify the customer about the status change

  res.status(200).json({
    success: true,
    data: order,
  });
});
