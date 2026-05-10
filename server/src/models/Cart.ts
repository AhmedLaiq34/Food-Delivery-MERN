import mongoose, { Schema, Document } from 'mongoose';
import { ICart } from '@shared/types';

export interface ICartDocument extends Omit<ICart, '_id' | 'user' | 'restaurant' | 'items'>, Document {
  user: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  items: any[];
}

const cartItemSchema = new Schema({
  menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String },
  toppings: [{ type: String }],
  specialInstructions: { type: String },
  itemTotal: { type: Number, required: true }
}, { _id: false });

const cartSchema = new Schema<ICartDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // One cart per user
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true }, // Cart is bound to one restaurant
  items: [cartItemSchema],
  subtotal: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  promoCode: { type: String }
});

export const Cart = mongoose.model<ICartDocument>('Cart', cartSchema);
