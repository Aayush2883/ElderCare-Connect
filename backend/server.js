import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import User from './models/User.js';
import seedData from './utils/seeder.js';

// Route imports
// Trigger nodemon reload for verified Cloudinary disk keys
import authRoutes from './routes/authRoutes.js';


import patientRoutes from './routes/patientRoutes.js';
import caregiverRoutes from './routes/caregiverRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import careNoteRoutes from './routes/careNoteRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/care-notes', careNoteRoutes);

// Simple Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Post-DB connection seeder runner (Auto-seed if no user exists)
const runAutoSeeding = async () => {
  try {
    const userCount = await User.countDocuments({});
    if (userCount === 0) {
      console.log('No users found in database. Initiating auto-seeding...');
      await seedData();
    }
  } catch (error) {
    console.error(`Auto-seeding check failed: ${error.message}`);
  }
};

// Check and seed
setTimeout(runAutoSeeding, 3000); // Small timeout to ensure mongoose connects first

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
