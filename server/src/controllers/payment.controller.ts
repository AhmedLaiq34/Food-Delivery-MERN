import { Request, Response } from 'express';
import Stripe from 'stripe';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { config } from '../config';
import { Order } from '../models/Order';
// import { io } from '../index'; // Would import socket to emit status changes

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16' as any, // Using string casting for older/newer version compatibility
});

export const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId).populate('restaurant');
  
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.customer.toString() !== req.user?.id) {
    throw new AppError('Not authorized to pay for this order', 403);
  }

  if (order.status !== 'placed') {
    throw new AppError(`Cannot pay for an order with status: ${order.status}`, 400);
  }

  if (order.paymentMethod !== 'stripe') {
    throw new AppError('This order is not set to be paid via Stripe', 400);
  }

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100), // Stripe expects amounts in cents
    currency: 'usd',
    metadata: {
      orderId: order._id.toString(),
      customerEmail: req.user?.email || '',
    },
  });

  // Save the intent ID to the order
  order.stripePaymentIntentId = paymentIntent.id;
  await order.save();

  res.status(200).json({
    success: true,
    data: {
      clientSecret: paymentIntent.client_secret,
    },
  });
});

export const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = config.stripe.webhookSecret;

  let event;

  try {
    // req.body is raw Buffer because of express.raw() in the route
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
  } catch (err: any) {
    throw new AppError(`Webhook Error: ${err.message}`, 400);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;
      
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, { status: 'preparing' });
        // Emit socket event here if io was imported:
        // io.to(`order:${orderId}`).emit('orderStatusChanged', { status: 'preparing' });
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, { status: 'payment_failed' });
        // Emit socket event here
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});
