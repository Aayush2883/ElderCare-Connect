import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Caregiver from '../models/Caregiver.js';

// @desc    Create a review for a caregiver
// @route   POST /api/reviews
// @access  Private (User Only)
export const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Fetch booking
    const booking = await Booking.findById(bookingId).populate('patientId');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Auth check: User must own the booking patient
    if (booking.patientId.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to review this booking');
    }

    // Must be completed
    if (booking.status !== 'completed') {
      res.status(400);
      throw new Error('Can only review completed bookings');
    }

    // Check if review already exists
    const reviewExists = await Review.findOne({ bookingId });
    if (reviewExists) {
      res.status(400);
      throw new Error('You have already submitted a review for this booking');
    }

    const review = await Review.create({
      bookingId,
      patientId: booking.patientId._id,
      caregiverId: booking.caregiverId,
      rating,
      comment,
    });

    // Update Caregiver ratings & review count
    const caregiverId = booking.caregiverId;
    const allReviews = await Review.find({ caregiverId });
    
    const totalReviews = allReviews.length;
    const avgRating = allReviews.reduce((sum, item) => sum + item.rating, 0) / totalReviews;

    await Caregiver.findByIdAndUpdate(caregiverId, {
      $set: {
        rating: parseFloat(avgRating.toFixed(1)),
        totalReviews,
      }
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews or filter by caregiverId
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res, next) => {
  try {
    const { caregiverId } = req.query;
    let query = {};

    if (caregiverId) {
      query.caregiverId = caregiverId;
    }

    const reviews = await Review.find(query)
      .populate({
        path: 'patientId',
        select: 'patientName'
      })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
