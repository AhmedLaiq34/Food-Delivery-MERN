import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from '@shared/types';

export interface ITransactionDocument extends Omit<ITransaction, '_id' | 'createdAt' | 'updatedAt' | 'chef'>, Document {
  chef: mongoose.Types.ObjectId;
}

const transactionSchema = new Schema<ITransactionDocument>({
  chef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  description: { type: String, required: true },
  bankAccount: { type: String } // e.g. masked last 4 digits
}, {
  timestamps: true
});

transactionSchema.index({ chef: 1, createdAt: -1 });

export const Transaction = mongoose.model<ITransactionDocument>('Transaction', transactionSchema);
