import mongoose, { Schema, Document } from 'mongoose';

export interface IOTPDocument extends Document {
  phone: string;
  code: string; // Hashed code
  expiresAt: Date;
}

const otpSchema = new Schema<IOTPDocument>({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// TTL index to automatically delete expired OTPs (10 minutes)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = mongoose.model<IOTPDocument>('OTP', otpSchema);
