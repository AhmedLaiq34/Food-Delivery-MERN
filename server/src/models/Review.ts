import mongoose, { Schema, Document } from 'mongoose';
import { IReview } from '@shared/types';

export interface IReviewDocument extends Omit<IReview, '_id' | 'createdAt' | 'updatedAt' | 'user' | 'target' | 'repliedAt'>, Document {
  user: mongoose.Types.ObjectId;
  target: mongoose.Types.ObjectId;
  repliedAt?: Date;
}

const reviewSchema = new Schema<IReviewDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['restaurant', 'menuItem'], required: true },
  target: { type: Schema.Types.ObjectId, required: true, refPath: 'targetType' }, // Polymorphic relation
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  reply: { type: String },
  repliedAt: { type: Date },
  isReported: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Compound index for querying reviews by target quickly
reviewSchema.index({ target: 1, targetType: 1 });

export const Review = mongoose.model<IReviewDocument>('Review', reviewSchema);
