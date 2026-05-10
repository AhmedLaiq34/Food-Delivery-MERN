import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '@shared/types';

// Omit the `_id`, `createdAt`, and `updatedAt` from the TS interface for Mongoose Document
export interface IUserDocument extends Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>, Document {
  password?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const addressSchema = new Schema({
  label: { type: String, enum: ['home', 'work', 'other'], required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const savedCardSchema = new Schema({
  stripePaymentMethodId: { type: String, required: true },
  brand: { type: String, required: true },
  last4: { type: String, required: true },
  expMonth: { type: Number, required: true },
  expYear: { type: Number, required: true }
}, { _id: false });

const userSchema = new Schema<IUserDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false }, // Never returned in queries
  phone: { type: String },
  phoneVerified: { type: Boolean, default: false },
  bio: { type: String },
  profilePicture: { type: String },
  role: { type: String, enum: ['customer', 'chef', 'admin'], default: 'customer' },
  addresses: [addressSchema],
  savedCards: { type: [savedCardSchema], select: false }, // Sensitive
  favourites: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
  provider: { type: String }, // For OAuth
  providerId: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date }
}, {
  timestamps: true
});

export const User = mongoose.model<IUserDocument>('User', userSchema);
