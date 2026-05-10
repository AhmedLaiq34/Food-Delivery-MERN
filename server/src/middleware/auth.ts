import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { User } from '../models/User';
import { config } from '../config';

import { IUserDocument } from '../models/User';

declare global {
  namespace Express {
    // Passport uses Express.User
    interface User extends IUserDocument {}
    
    interface Request {
      user?: User;
    }
  }
}

interface JwtPayload {
  id: string;
  role: string;
}

export const authenticate = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    req.user = currentUser as Express.User;
    next();
  } catch (err) {
    return next(new AppError('Invalid token or token has expired', 401));
  }
});

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
