import express from 'express';
import {
  register,
  login,
  getProfile,
  getAllUsers,
  deleteUser,
  verifyEmail,
  resendVerification,
  uploadDegree,
} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validateRegisterInput, validateResendInput } from '../middleware/validationMiddleware.js';
import { verificationLimiter } from '../middleware/rateLimitMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', upload.single('profilePhoto'), validateRegisterInput, register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

router.get('/verify-email/:token', verificationLimiter, verifyEmail);
router.post('/resend-verification', verificationLimiter, validateResendInput, resendVerification);
router.post('/upload-degree', protect, upload.single('degreeDocument'), uploadDegree);

// Admin-only user administration routes
router.route('/users')
  .get(protect, adminOnly, getAllUsers);

router.route('/users/:id')
  .delete(protect, adminOnly, deleteUser);


export default router;
