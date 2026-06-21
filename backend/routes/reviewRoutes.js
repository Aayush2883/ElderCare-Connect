import express from 'express';
import { createReview, getReviews } from '../controllers/reviewController.js';
import { protect, userOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(protect, userOnly, createReview);

export default router;
