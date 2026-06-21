import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientName: {
      type: String,
      required: [true, 'Please add the patient\'s name'],
    },
    age: {
      type: Number,
      required: [true, 'Please add the patient\'s age'],
    },
    gender: {
      type: String,
      required: [true, 'Please specify the patient\'s gender'],
      enum: ['Male', 'Female', 'Other'],
    },
    address: {
      type: String,
      required: [true, 'Please add the patient\'s address'],
    },
    medicalNeeds: {
      type: String,
      required: [true, 'Please add patient medical needs or conditions'],
    },
    emergencyContact: {
      type: String,
      required: [true, 'Please add an emergency contact number'],
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
