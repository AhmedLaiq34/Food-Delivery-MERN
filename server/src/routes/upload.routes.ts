import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { upload } from '../config/cloudinary';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

const router = Router();

// Protect all upload routes
router.use(authenticate);

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No image file provided', 400);
  }

  // The file is already uploaded to Cloudinary by Multer,
  // and the URL is available at req.file.path
  res.status(200).json({
    success: true,
    data: {
      url: req.file.path,
    },
  });
});

// Accept a single file under the field name 'image'
router.post('/image', upload.single('image'), uploadImage);

export default router;
