import { Router } from 'express';
import { register, login, logout, refresh, forgotPassword, resetPassword, sendOTP, verifyOTP } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, otpSendSchema, otpVerifySchema } from '../utils/validators';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validateRequest(resetPasswordSchema), resetPassword);
router.post('/otp/send', validateRequest(otpSendSchema), sendOTP);
router.post('/otp/verify', validateRequest(otpVerifySchema), verifyOTP);

// TODO: Add OAuth routes

export default router;
