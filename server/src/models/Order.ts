import mongoose, { Schema, Document } from 'mongoose';
import { IOrder } from '@shared/types';

export interface IOrderDocument extends Omit<IOrder, '_id' | 'createdAt' | 'updatedAt' | 'customer' | 'restaurant' | 'items'>, Document {
  customer: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  items: any[]; // Avoid complex deep typing for Mongoose subdocs here
}

const cartItemSchema = new Schema({
  menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String },
  toppings: [{ type: String }],
  specialInstructions: { type: String },
  itemTotal: { type: Number, required: true }
}, { _id: false });

const orderSchema = new Schema<IOrderDocument>({
  orderId: { type: String, required: true, unique: true }, // e.g. ORD-12345
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [cartItemSchema],
  status: { 
    type: String, 
    enum: ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'payment_failed'],
    default: 'placed'
  },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  tax: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, enum: ['cod', 'stripe'], required: true },
  stripePaymentIntentId: { type: String },
  isDelivery: { type: Boolean, default: true },
  estimatedDelivery: { type: Date }
}, {
  timestamps: true
});

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1 });

export const Order = mongoose.model<IOrderDocument>('Order', orderSchema);
