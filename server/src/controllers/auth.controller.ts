import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { User } from '../models/User';
import { OTP } from '../models/OTP';
import { TokenService } from '../services/token.service';
import { config } from '../config';

const setTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already in use', 409);
  }

  const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'customer',
  });

  const tokens = await TokenService.generateAuthTokens(user);
  setTokenCookie(res, tokens.refreshToken);

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json({
    success: true,
    data: {
      user: userResponse,
      accessToken: tokens.accessToken,
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const tokens = await TokenService.generateAuthTokens(user);
  setTokenCookie(res, tokens.refreshToken);

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json({
    success: true,
    data: {
      user: userResponse,
      accessToken: tokens.accessToken,
    },
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  
  if (refreshToken) {
    await TokenService.removeToken(refreshToken);
  }

  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

import { RefreshToken } from '../models/RefreshToken';

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError('No refresh token provided', 401);
  }

  const storedToken = await RefreshToken.findOne({ token: refreshToken }).populate('user');
  
  if (!storedToken) {
    throw new AppError('Invalid refresh token', 401);
  }

  if (storedToken.expiresAt < new Date()) {
    await TokenService.removeToken(refreshToken);
    throw new AppError('Refresh token expired', 401);
  }

  // Rotate token (delete old, create new)
  await TokenService.removeToken(refreshToken);

  const user = storedToken.user as any;
  const tokens = await TokenService.generateAuthTokens(user);
  
  setTokenCookie(res, tokens.refreshToken);

  res.status(200).json({
    success: true,
    data: {
      accessToken: tokens.accessToken,
    },
  });
});

import { EmailService } from '../services/email.service';

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('There is no user with that email address.', 404);
  }

  // Generate random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token before saving to database (for security)
  const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  // Expires in 1 hour
  const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); 

  await User.findByIdAndUpdate(user._id, {
    passwordResetToken,
    passwordResetExpires
  });

  try {
    await EmailService.sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      success: true,
      message: 'Token sent to email!'
    });
  } catch (err) {
    await User.findByIdAndUpdate(user._id, {
      $unset: { passwordResetToken: 1, passwordResetExpires: 1 }
    });
    throw new AppError('There was an error sending the email. Try again later!', 500);
  }
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { password } = req.body;
  const token = req.params.token as string;

  // Hash the incoming token to match what's in the DB
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() }
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired', 400);
  }

  user.password = await bcrypt.hash(password, config.bcryptSaltRounds);
  
  // Explicitly clear reset token fields
  await User.findByIdAndUpdate(user._id, {
    password: user.password,
    $unset: { passwordResetToken: 1, passwordResetExpires: 1 }
  });

  // Security: Invalidate all existing refresh tokens
  await TokenService.clearAllTokens(user._id);

  // Auto login after reset
  const tokens = await TokenService.generateAuthTokens(user);
  setTokenCookie(res, tokens.refreshToken);

  res.status(200).json({
    success: true,
    message: 'Password reset successful!',
    data: { accessToken: tokens.accessToken }
  });
});

import { TwilioService } from '../services/twilio.service';

export const sendOTP = catchAsync(async (req: Request, res: Response) => {
  const { phone } = req.body;

  // Generate 6 digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash the code
  const hashedCode = await bcrypt.hash(code, 10);
  
  // 10 minutes expiry
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Clear existing OTPs for this phone
  await OTP.deleteMany({ phone });

  await OTP.create({
    phone,
    code: hashedCode,
    expiresAt
  });

  await TwilioService.sendOTP(phone, code);

  res.status(200).json({
    success: true,
    message: 'OTP sent successfully!'
  });
});

export const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const { phone, code } = req.body;

  const otpRecord = await OTP.findOne({ phone, expiresAt: { $gt: new Date() } });

  if (!otpRecord) {
    throw new AppError('OTP is invalid or has expired', 400);
  }

  const isMatch = await bcrypt.compare(code, otpRecord.code);
  if (!isMatch) {
    throw new AppError('Invalid OTP code', 400);
  }

  // OTP is valid, mark user phone as verified if they exist
  const user = await User.findOneAndUpdate(
    { phone },
    { phoneVerified: true },
    { new: true }
  );

  // Delete the OTP record
  await OTP.deleteOne({ _id: otpRecord._id });

  res.status(200).json({
    success: true,
    message: 'Phone verified successfully!'
  });
});
