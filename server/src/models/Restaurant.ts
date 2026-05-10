import mongoose, { Schema, Document } from 'mongoose';
import { IRestaurant } from '@shared/types';

export interface IRestaurantDocument extends Omit<IRestaurant, '_id' | 'createdAt' | 'updatedAt' | 'owner'>, Document {
  owner: mongoose.Types.ObjectId;
}

const addressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
}, { _id: false });

const restaurantSchema = new Schema<IRestaurantDocument>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  coverImage: { type: String, required: true },
  images: [{ type: String }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  deliveryTime: { type: String, required: true }, // e.g. "30-45 min"
  deliveryFee: { type: Number, required: true },
  isOpen: { type: Boolean, default: true },
  cuisines: [{ type: String }],
  address: { type: addressSchema, required: true },
  openingHours: {
    open: { type: String, required: true }, // e.g. "09:00"
    close: { type: String, required: true } // e.g. "22:00"
  }
}, {
  timestamps: true
});

// Index for geo-spatial search could be added here later if needed
restaurantSchema.index({ name: 'text', cuisines: 'text' });

export const Restaurant = mongoose.model<IRestaurantDocument>('Restaurant', restaurantSchema);
