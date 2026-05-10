import { Router } from 'express';
import { getProfile, updateProfile, addAddress, toggleFavourite } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { updateProfileSchema, addAddressSchema } from '../utils/apiValidators';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.route('/profile')
  .get(getProfile)
  .put(validateRequest(updateProfileSchema), updateProfile);

router.post('/addresses', validateRequest(addAddressSchema), addAddress);
router.post('/favourites/:restaurantId', toggleFavourite);

export default router;
