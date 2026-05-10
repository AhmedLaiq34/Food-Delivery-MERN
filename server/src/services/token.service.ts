import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Types } from 'mongoose';
import { config } from '../config';
import { RefreshToken } from '../models/RefreshToken';

export class TokenService {
  /**
   * Generates Access and Refresh tokens
   */
  static async generateAuthTokens(user: { _id: Types.ObjectId | string, role: string }) {
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiry as any }
    );

    const refreshToken = crypto.randomBytes(40).toString('hex');
    
    // 7 days in milliseconds
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt
    });

    return {
      accessToken,
      refreshToken
    };
  }

  /**
   * Removes a refresh token from the database
   */
  static async removeToken(token: string) {
    await RefreshToken.findOneAndDelete({ token });
  }

  /**
   * Clears all refresh tokens for a user (e.g., on password reset)
   */
  static async clearAllTokens(userId: Types.ObjectId | string) {
    await RefreshToken.deleteMany({ user: userId });
  }
}
