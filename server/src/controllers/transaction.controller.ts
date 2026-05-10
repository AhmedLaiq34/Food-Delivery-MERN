import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { Transaction } from '../models/Transaction';

export const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const transactions = await Transaction.find({ chef: req.user?.id }).sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});

export const requestWithdrawal = catchAsync(async (req: Request, res: Response) => {
  const { amount, bankAccount } = req.body;

  // Ideally, you'd check if the chef has enough balance before creating a withdrawal request
  
  const transaction = await Transaction.create({
    chef: req.user?.id,
    type: 'debit',
    amount,
    description: 'Withdrawal Request',
    status: 'pending',
    bankAccount,
  });

  res.status(201).json({
    success: true,
    data: transaction,
  });
});

// Admin only
export const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const transactions = await Transaction.find().populate('chef', 'name email').sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});
