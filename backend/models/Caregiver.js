import mongoose from 'mongoose';

const caregiverSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please add a specialization (e.g., Nurse, Physiotherapist, Elderly Attendant)'],
    },
    qualification: {
      type: String,
      default: '',
    },
    degreeDocument: {
      type: String,
      default: '',
    },
    experience: {
      type: Number,
      required: [true, 'Please add experience in years'],
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    serviceArea: {
      type: String,
      required: [true, 'Please add your service area'],
    },
    availability: {
      type: [String], // Array of days, e.g. ["Monday", "Tuesday", "Wednesday"]
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    profilePhoto: {
      type: String,
      default: '', // Placeholder or URL
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Caregiver = mongoose.model('Caregiver', caregiverSchema);
export default Caregiver;
