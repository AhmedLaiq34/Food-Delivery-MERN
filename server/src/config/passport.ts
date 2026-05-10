import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { User } from '../models/User';
import { config } from './index';

// We don't need serialize/deserialize because we use JWT instead of sessions
// but passport might complain if we don't provide dummy ones when using passport.authenticate
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Helper to handle OAuth login/register
const handleOAuthUser = async (provider: string, profile: any, done: any) => {
  try {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : undefined;
    
    // Try to find by provider ID first
    let user = await User.findOne({ providerId: profile.id, provider });
    
    if (!user && email) {
      // If not found by provider ID, try finding by email
      user = await User.findOne({ email });
      if (user) {
        // Link the OAuth account to the existing email account
        user.provider = provider;
        user.providerId = profile.id;
        await user.save();
      }
    }

    if (!user) {
      // If totally new user, create them
      user = await User.create({
        name: profile.displayName || profile.username || 'User',
        email: email || `${profile.id}@${provider}.com`, // Fallback if no email provided
        provider,
        providerId: profile.id,
        role: 'customer',
        profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
};

// Google Strategy
if (config.oauth.google.clientId && config.oauth.google.clientSecret) {
  passport.use(new GoogleStrategy({
    clientID: config.oauth.google.clientId,
    clientSecret: config.oauth.google.clientSecret,
    callbackURL: `${config.oauth.callbackUrl}/google/callback`
  }, (accessToken, refreshToken, profile, done) => {
    handleOAuthUser('google', profile, done);
  }));
}

// Facebook Strategy
if (config.oauth.facebook.appId && config.oauth.facebook.appSecret) {
  passport.use(new FacebookStrategy({
    clientID: config.oauth.facebook.appId,
    clientSecret: config.oauth.facebook.appSecret,
    callbackURL: `${config.oauth.callbackUrl}/facebook/callback`,
    profileFields: ['id', 'displayName', 'emails', 'photos']
  }, (accessToken, refreshToken, profile, done) => {
    handleOAuthUser('facebook', profile, done);
  }));
}

// Twitter Strategy
if (config.oauth.twitter.apiKey && config.oauth.twitter.apiSecret) {
  passport.use(new TwitterStrategy({
    consumerKey: config.oauth.twitter.apiKey,
    consumerSecret: config.oauth.twitter.apiSecret,
    callbackURL: `${config.oauth.callbackUrl}/twitter/callback`,
    includeEmail: true
  }, (token, tokenSecret, profile, done) => {
    handleOAuthUser('twitter', profile, done);
  }));
}

export default passport;
