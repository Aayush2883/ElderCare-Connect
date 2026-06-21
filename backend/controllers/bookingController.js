import Booking from '../models/Booking.js';
import Patient from '../models/Patient.js';
import Caregiver from '../models/Caregiver.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import { sendBookingConfirmationEmail } from '../services/emailService.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User Only)
export const createBooking = async (req, res, next) => {
  try {
    const { patientId, caregiverId, serviceId, bookingDate, bookingTime, duration } = req.body;

    // Check if patient exists and belongs to user
    const patient = await Patient.findById(patientId);
    if (!patient) {
      res.status(404);
      throw new Error('Patient profile not found');
    }
    if (patient.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to book services for this patient');
    }

    // Check if caregiver exists
    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) {
      res.status(404);
      throw new Error('Caregiver profile not found');
    }
    if (caregiver.verificationStatus !== 'verified') {
      res.status(400);
      throw new Error('Caregiver is not verified to take bookings');
    }

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    const booking = await Booking.create({
      patientId,
      caregiverId,
      serviceId,
      bookingDate,
      bookingTime,
      duration,
      status: 'pending',
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for logged in user (Patients they created), caregiver, or admin
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'admin') {
      // Admin sees everything
    } else if (req.user.role === 'caregiver') {
      // Find caregiver profile first
      const caregiver = await Caregiver.findOne({ userId: req.user._id });
      if (!caregiver) {
        return res.json([]); // No profile, return empty list
      }
      query.caregiverId = caregiver._id;
    } else {
      // User role: Find patients belonging to user
      const patients = await Patient.find({ userId: req.user._id });
      const patientIds = patients.map(p => p._id);
      query.patientId = { $in: patientIds };
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'caregiverId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('serviceId')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'caregiverId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('serviceId');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Auth check
    const isUserOwner = req.user.role === 'user' && booking.patientId.userId._id.toString() === req.user._id.toString();
    const isCaregiverOwner = req.user.role === 'caregiver' && booking.caregiverId.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isUserOwner && !isCaregiverOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to view this booking');
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // pending, accepted, ongoing, completed, cancelled
    const booking = await Booking.findById(req.params.id)
      .populate('patientId')
      .populate('caregiverId');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    const isUserOwner = req.user.role === 'user' && booking.patientId.userId.toString() === req.user._id.toString();
    const isCaregiverOwner = req.user.role === 'caregiver' && booking.caregiverId.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isUserOwner && !isCaregiverOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to update this booking status');
    }

    // Role-based status updates restrictions
    if (req.user.role === 'user') {
      if (status !== 'cancelled') {
        res.status(400);
        throw new Error('Users can only set booking status to cancelled');
      }
      if (['ongoing', 'completed', 'cancelled'].includes(booking.status)) {
        res.status(400);
        throw new Error('Cannot cancel active or completed bookings');
      }
    }

    if (req.user.role === 'caregiver') {
      if (!['accepted', 'ongoing', 'completed', 'cancelled'].includes(status)) {
        res.status(400);
        throw new Error('Invalid caregiver status transition');
      }
      // Caregiver rejecting a booking sets status to cancelled
    }

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    if (status === 'accepted' && oldStatus !== 'accepted') {
      try {
        const populatedBooking = await Booking.findById(booking._id)
          .populate({
            path: 'patientId',
            populate: { path: 'userId', select: 'name email phone' }
          })
          .populate({
            path: 'caregiverId',
            populate: { path: 'userId', select: 'name email phone' }
          })
          .populate('serviceId');

        if (populatedBooking && populatedBooking.patientId && populatedBooking.patientId.userId) {
          const patientUser = populatedBooking.patientId.userId;
          const caregiverUser = populatedBooking.caregiverId ? populatedBooking.caregiverId.userId : null;
          
          if (patientUser.email) {
            await sendBookingConfirmationEmail(patientUser, {
              caregiverName: caregiverUser ? caregiverUser.name : 'Vetted Caregiver',
              caregiverPhone: caregiverUser ? caregiverUser.phone : 'N/A',
              patientName: populatedBooking.patientId.patientName,
              serviceName: populatedBooking.serviceId ? populatedBooking.serviceId.serviceName : 'Elderly Care Assistance',
              bookingDate: new Date(populatedBooking.bookingDate).toLocaleDateString(),
              bookingTime: populatedBooking.bookingTime,
              duration: populatedBooking.duration,
            });
          }
        }
      } catch (err) {
        console.error(`Failed to send booking confirmation email: \${err.message}`);
      }
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Cancel booking (Admin delete, or cancel fallback)
// @route   DELETE /api/bookings/:id
// @access  Private
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Only admins can delete bookings');
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Analytics
// @route   GET /api/bookings/admin/analytics
// @access  Private (Admin Only)
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCaregivers = await User.countDocuments({ role: 'caregiver' });
    const verifiedCaregivers = await Caregiver.countDocuments({ verificationStatus: 'verified' });
    const totalBookings = await Booking.countDocuments({});
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    // Calculate Average Caregiver Rating
    const ratings = await Caregiver.aggregate([
      { $match: { totalReviews: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const avgCaregiverRating = ratings.length > 0 ? parseFloat(ratings[0].avgRating.toFixed(1)) : 0;

    // Monthly Booking Statistics
    const monthlyStats = await Booking.aggregate([
      {
        $group: {
          _id: { $month: '$bookingDate' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyStats = monthlyStats.map(item => ({
      month: monthNames[item._id - 1] || `Month ${item._id}`,
      bookings: item.count
    }));

    res.json({
      totalUsers,
      totalCaregivers,
      verifiedCaregivers,
      totalBookings,
      completedBookings,
      pendingBookings,
      avgCaregiverRating,
      monthlyBookingStats: formattedMonthlyStats
    });
  } catch (error) {
    next(error);
  }
};
