import CareNote from '../models/CareNote.js';
import Booking from '../models/Booking.js';
import Caregiver from '../models/Caregiver.js';

// @desc    Add care notes to a booking
// @route   POST /api/care-notes
// @access  Private (Caregiver Only)
export const createCareNote = async (req, res, next) => {
  try {
    const { bookingId, notes } = req.body;

    const booking = await Booking.findById(bookingId).populate('caregiverId');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Auth check: Must be the caregiver assigned to this booking
    if (booking.caregiverId.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to add care notes for this booking');
    }

    const careNote = await CareNote.create({
      bookingId,
      caregiverId: booking.caregiverId._id,
      notes,
    });

    res.status(201).json(careNote);
  } catch (error) {
    next(error);
  }
};

// @desc    Get care notes for a specific booking
// @route   GET /api/care-notes/booking/:bookingId
// @access  Private
export const getCareNotesByBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate('patientId').populate('caregiverId');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Auth check: Patient's user parent, caregiver, or Admin
    const isUserOwner = req.user.role === 'user' && booking.patientId.userId.toString() === req.user._id.toString();
    const isCaregiverOwner = req.user.role === 'caregiver' && booking.caregiverId.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isUserOwner && !isCaregiverOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to access care notes for this booking');
    }

    const careNotes = await CareNote.find({ bookingId }).sort({ createdAt: -1 });
    res.json(careNotes);
  } catch (error) {
    next(error);
  }
};
