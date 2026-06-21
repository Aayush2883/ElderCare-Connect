import express from 'express';
import {
  upsertCaregiverProfile,
  getCaregivers,
  getCaregiverById,
  updateCaregiver,
  verifyCaregiver,
} from '../controllers/caregiverController.js';
import { protect, adminOnly, caregiverOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCaregivers)
  .post(
    protect,
    caregiverOnly,
    upload.fields([
      { name: 'profilePhoto', maxCount: 1 },
      { name: 'degreeDocument', maxCount: 1 }
    ]),
    upsertCaregiverProfile
  );

router.route('/:id')
  .get(getCaregiverById)
  .put(protect, updateCaregiver);

router.route('/:id/verify')
  .put(protect, adminOnly, verifyCaregiver);

export default router;
