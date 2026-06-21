import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Caregiver',
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: [true, 'Please specify the booking date'],
    },
    bookingTime: {
      type: String,
      required: [true, 'Please specify the booking start time (e.g., "09:00 AM")'],
    },
    duration: {
      type: String,
      required: [true, 'Please specify the booking duration (e.g., "4 hours", "1 day")'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
