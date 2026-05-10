import mongoose, { Schema, Document } from 'mongoose';
import { IPromotion } from '@shared/types';

export interface IPromotionDocument extends Omit<IPromotion, '_id' | 'createdAt' | 'updatedAt' | 'expiryDate'>, Document {
  expiryDate: Date;
}

const promotionSchema = new Schema<IPromotionDocument>({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountAmount: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxUsage: { type: Number, default: 0 }, // 0 means unlimited
  currentUsage: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Promotion = mongoose.model<IPromotionDocument>('Promotion', promotionSchema);
