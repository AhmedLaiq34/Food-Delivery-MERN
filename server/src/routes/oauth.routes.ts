import { Router } from 'express';
import passport from 'passport';
import { config } from '../config';
import { TokenService } from '../services/token.service';

const router = Router();

// Callback handler to generate JWT and redirect to frontend
const oauthCallbackHandler = async (req: any, res: any) => {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`${config.clientUrl}/login?error=oauth_failed`);
    }

    const tokens = await TokenService.generateAuthTokens(user);
    
    // Set refresh token as cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend with access token in URL
    // The frontend will grab this token, save it, and clear the URL
    res.redirect(`${config.clientUrl}/login?token=${tokens.accessToken}`);
  } catch (error) {
    res.redirect(`${config.clientUrl}/login?error=oauth_failed`);
  }
};

// Google Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${config.clientUrl}/login?error=oauth_failed`, session: false }),
  oauthCallbackHandler
);

// Facebook Routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: `${config.clientUrl}/login?error=oauth_failed`, session: false }),
  oauthCallbackHandler
);

// Twitter Routes
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: `${config.clientUrl}/login?error=oauth_failed`, session: false }),
  oauthCallbackHandler
);

export default router;
