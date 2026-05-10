import { z } from 'zod';

// Password complexity: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().regex(
      passwordRegex,
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
    role: z.enum(['customer', 'chef', 'admin']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().regex(passwordRegex, 'Password must meet complexity requirements'),
  }),
  params: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
});

export const otpSendSchema = z.object({
  body: z.object({
    phone: z.string().min(10, 'Invalid phone number'),
  }),
});

export const otpVerifySchema = z.object({
  body: z.object({
    phone: z.string().min(10, 'Invalid phone number'),
    code: z.string().length(6, 'OTP must be 6 digits'),
  }),
});
