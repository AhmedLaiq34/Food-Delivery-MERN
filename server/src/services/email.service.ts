import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export class EmailService {
  static async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;

    const mailOptions = {
      from: config.email.from,
      to,
      subject: 'FoodDash - Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Please click the link below to reset your password.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>This link is valid for 1 hour.</p>
      `,
    };

    if (config.nodeEnv === 'development' && !config.email.host) {
      // In dev mode without SMTP, just log the URL to console
      console.log('----------------------------------------------------');
      console.log('DEV MODE: Email not configured.');
      console.log(`Password reset link for ${to}: ${resetUrl}`);
      console.log('----------------------------------------------------');
      return;
    }

    await transporter.sendMail(mailOptions);
  }
}
