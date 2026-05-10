import twilio from 'twilio';
import { config } from '../config';

const client = config.twilio.accountSid && config.twilio.authToken
  ? twilio(config.twilio.accountSid, config.twilio.authToken)
  : null;

export class TwilioService {
  static async sendOTP(to: string, code: string) {
    if (config.nodeEnv === 'development' && !client) {
      console.log('----------------------------------------------------');
      console.log('DEV MODE: Twilio not configured.');
      console.log(`OTP Code for ${to}: ${code}`);
      console.log('----------------------------------------------------');
      return;
    }

    if (!client) {
      throw new Error('Twilio client not configured');
    }

    await client.messages.create({
      body: `Your FoodDash verification code is: ${code}. Valid for 10 minutes.`,
      from: config.twilio.phoneNumber,
      to,
    });
  }
}
