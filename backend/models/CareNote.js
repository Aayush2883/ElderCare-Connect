import mongoose from 'mongoose';

const careNoteSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Caregiver',
      required: true,
    },
    notes: {
      type: String,
      required: [true, 'Please add details for the care note'],
    },
  },
  {
    timestamps: true,
  }
);

const CareNote = mongoose.model('CareNote', careNoteSchema);
export default CareNote;
