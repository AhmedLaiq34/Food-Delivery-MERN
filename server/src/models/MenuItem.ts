import mongoose, { Schema, Document } from 'mongoose';
import { IMenuItem } from '@shared/types';

export interface IMenuItemDocument extends Omit<IMenuItem, '_id' | 'createdAt' | 'updatedAt' | 'restaurant'>, Document {
  restaurant: mongoose.Types.ObjectId;
}

const menuItemSchema = new Schema<IMenuItemDocument>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  category: { 
    type: String, 
    enum: ['burger', 'pizza', 'sandwich', 'hot_dog', 'salad', 'dessert', 'drinks', 'other'],
    required: true 
  },
  mealTime: { 
    type: String, 
    enum: ['all', 'breakfast', 'lunch', 'dinner'],
    default: 'all'
  },
  ingredients: [{ type: String }],
  sizes: [{
    name: { type: String, required: true },
    priceModifier: { type: Number, required: true }
  }],
  toppings: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  isSoldOut: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Compound index for fast querying by restaurant and category
menuItemSchema.index({ restaurant: 1, category: 1 });

export const MenuItem = mongoose.model<IMenuItemDocument>('MenuItem', menuItemSchema);
