import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, 'Please add a service name'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a service description'],
    },
    duration: {
      type: String,
      required: [true, 'Please specify the default duration (e.g., "per hour", "per day", "2 hours")'],
    },
    price: {
      type: Number,
      required: [true, 'Please specify the price'],
    },
    requiredQualification: {
      type: String,
      required: [true, 'Please specify required qualifications for caregivers performing this service'],
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
