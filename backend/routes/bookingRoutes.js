import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getAdminAnalytics,
} from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All booking routes require login

// Analytics route MUST be defined before parametric /:id routes
router.get('/admin/analytics', adminOnly, getAdminAnalytics);

router.route('/')
  .post(createBooking)
  .get(getBookings);

router.route('/:id')
  .get(getBookingById)
  .delete(adminOnly, deleteBooking);

router.route('/:id/status')
  .put(updateBookingStatus);

export default router;
