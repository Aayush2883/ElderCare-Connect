import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Caregiver from '../models/Caregiver.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import CareNote from '../models/CareNote.js';
import Review from '../models/Review.js';

dotenv.config();

const seedData = async () => {
  try {
    // Clear all existing data
    await User.deleteMany();
    await Patient.deleteMany();
    await Caregiver.deleteMany();
    await Service.deleteMany();
    await Booking.deleteMany();
    await CareNote.deleteMany();
    await Review.deleteMany();

    console.log('Database cleared...');

    // Hashing passwords helper
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedCaregiverPassword = await bcrypt.hash('caregiver123', salt);
    const hashedUserPassword = await bcrypt.hash('user123', salt);

    // 1. Create Admin
    const admin = await User.create({
      name: 'Rajesh Kumar (Admin)',
      email: 'admin@eldercare.com',
      password: 'admin123', // Pre-saved hook handles hashing but we can write direct or let User model handle it
      phone: '9876543210',
      role: 'admin',
      emailVerified: true,
    });
    console.log('Admin account created: admin@eldercare.com / admin123');

    // 2. Create Caregiver Users & Profiles
    const cg1User = await User.create({
      name: 'Priya Sharma',
      email: 'nurse1@eldercare.com',
      password: 'caregiver123',
      phone: '9811223344',
      role: 'caregiver',
      emailVerified: true,
    });
    const cg1 = await Caregiver.create({
      userId: cg1User._id,
      specialization: 'Registered Nurse',
      qualification: 'B.Sc in Nursing, Delhi University',
      degreeDocument: '/uploads/dummy-degree.pdf',
      experience: 5,
      hourlyRate: 350,
      serviceArea: 'Connaught Place, New Delhi',
      availability: ['Monday', 'Wednesday', 'Friday'],
      verificationStatus: 'verified',
      profilePhoto: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150',
      rating: 5,
      totalReviews: 1
    });

    const cg2User = await User.create({
      name: 'Amit Patel',
      email: 'physio1@eldercare.com',
      password: 'caregiver123',
      phone: '9822334455',
      role: 'caregiver',
      emailVerified: true,
    });
    const cg2 = await Caregiver.create({
      userId: cg2User._id,
      specialization: 'Physiotherapist',
      qualification: 'Bachelor of Physiotherapy (BPT), Mumbai University',
      degreeDocument: '/uploads/dummy-degree.pdf',
      experience: 8,
      hourlyRate: 500,
      serviceArea: 'Andheri West, Mumbai',
      availability: ['Tuesday', 'Thursday'],
      verificationStatus: 'verified',
      profilePhoto: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=150',
      rating: 0,
      totalReviews: 0
    });

    const cg3User = await User.create({
      name: 'Ananya Rao',
      email: 'attendant1@eldercare.com',
      password: 'caregiver123',
      phone: '9833445566',
      role: 'caregiver',
      emailVerified: true,
    });
    const cg3 = await Caregiver.create({
      userId: cg3User._id,
      specialization: 'Elderly Attendant',
      qualification: 'General Nursing & Midwifery (GNM) Diploma',
      degreeDocument: '/uploads/dummy-degree.pdf',
      experience: 3,
      hourlyRate: 200,
      serviceArea: 'Jayanagar, Bengaluru',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      verificationStatus: 'verified',
      profilePhoto: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150',
      rating: 0,
      totalReviews: 0
    });

    const cg4User = await User.create({
      name: 'Rohan Verma',
      email: 'caregiver2@eldercare.com',
      password: 'caregiver123',
      phone: '9844556677',
      role: 'caregiver',
      emailVerified: true,
    });
    const cg4 = await Caregiver.create({
      userId: cg4User._id,
      specialization: 'Post-Hospital Care',
      qualification: 'Licensed Nursing Practitioner (LNP)',
      degreeDocument: '/uploads/dummy-degree.pdf',
      experience: 6,
      hourlyRate: 300,
      serviceArea: 'Salt Lake, Kolkata',
      availability: ['Saturday', 'Sunday'],
      verificationStatus: 'verified',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 0,
      totalReviews: 0
    });

    const cg5User = await User.create({
      name: 'Sunita Deshmukh',
      email: 'caregiver3@eldercare.com',
      password: 'caregiver123',
      phone: '9855667788',
      role: 'caregiver',
      emailVerified: true,
    });
    const cg5 = await Caregiver.create({
      userId: cg5User._id,
      specialization: 'Elderly Attendant',
      qualification: 'Certified Elder Care Assistant, Red Cross Training',
      degreeDocument: '/uploads/dummy-degree.pdf',
      experience: 2,
      hourlyRate: 180,
      serviceArea: 'Aundh, Pune',
      availability: ['Wednesday', 'Thursday'],
      verificationStatus: 'pending',
      profilePhoto: 'https://images.unsplash.com/photo-1614495022447-175656885661?w=150',
      rating: 0,
      totalReviews: 0
    });

    console.log('5 Caregiver users and profiles created (4 verified, 1 pending)...');

    // 3. Create Services
    const s1 = await Service.create({
      serviceName: 'Nursing Care',
      description: 'Professional medical nursing assistance including wound care, injections, medication administration, and vitals monitoring.',
      duration: 'per hour',
      price: 350,
      requiredQualification: 'Registered Nurse / LNP',
    });

    const s2 = await Service.create({
      serviceName: 'Elderly Attendant',
      description: 'Non-medical daily living support including assistance with feeding, bathing, grooming, and companionship.',
      duration: 'per day',
      price: 1200,
      requiredQualification: 'Certified Nursing Assistant / GNM / Care Experience',
    });

    const s3 = await Service.create({
      serviceName: 'Physiotherapy',
      description: 'Specialized physical therapy sessions tailored for elderly rehab, joint mobility, stroke recovery, or pain management.',
      duration: '1 hour session',
      price: 500,
      requiredQualification: 'Bachelor of Physiotherapy / Master of Physiotherapy',
    });

    const s4 = await Service.create({
      serviceName: 'Post-Hospital Care',
      description: 'Structured care focus on transitioning home from hospital recovery, scheduling therapist visits, and clinical observation.',
      duration: 'per day',
      price: 1500,
      requiredQualification: 'Licensed Nurse or Certified Professional',
    });

    console.log('4 Sample Services created...');

    // 4. Create Standard User & Patient Profile
    const familyUser = await User.create({
      name: 'Arjun Mehta',
      email: 'user@eldercare.com',
      password: 'user123',
      phone: '9911223344',
      role: 'user',
      emailVerified: true,
    });

    const patient = await Patient.create({
      userId: familyUser._id,
      patientName: 'Ramesh Mehta',
      age: 78,
      gender: 'Male',
      address: 'Sector 15, Noida, Uttar Pradesh',
      medicalNeeds: 'Post-stroke mobility rehabilitation, medication reminder schedules, daily vitals recording',
      emergencyContact: '9911223344',
    });

    console.log('User account and patient profile created: user@eldercare.com / user123');

    // 5. Create Sample Bookings
    // Completed Booking
    const bookingCompleted = await Booking.create({
      patientId: patient._id,
      caregiverId: cg1._id, // Priya Sharma
      serviceId: s1._id, // Nursing Care
      bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      bookingTime: '09:00 AM',
      duration: '4 hours',
      status: 'completed',
    });

    // Ongoing Booking
    const bookingOngoing = await Booking.create({
      patientId: patient._id,
      caregiverId: cg3._id, // Ananya Rao
      serviceId: s2._id, // Elderly Attendant
      bookingDate: new Date(), // Today
      bookingTime: '08:00 AM',
      duration: '1 day',
      status: 'ongoing',
    });

    // Pending Booking
    const bookingPending = await Booking.create({
      patientId: patient._id,
      caregiverId: cg2._id, // Amit Patel
      serviceId: s3._id, // Physiotherapy
      bookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days in the future
      bookingTime: '11:00 AM',
      duration: '1 hour session',
      status: 'pending',
    });

    console.log('Sample bookings created (1 completed, 1 ongoing, 1 pending)...');

    // 6. Create Care Notes for the Completed Booking
    const note = await CareNote.create({
      bookingId: bookingCompleted._id,
      caregiverId: cg1._id,
      notes: 'Patient Ramesh Mehta was alert and communicative. Check HGB and blood pressure (vitals: 128/82 mmHg, HR: 74 bpm). Medication taken on time. Advised continued light stretches and movement.',
    });
    console.log('Sample Care Note created...');

    // 7. Create Review for the Completed Booking
    const review = await Review.create({
      bookingId: bookingCompleted._id,
      patientId: patient._id,
      caregiverId: cg1._id,
      rating: 5,
      comment: 'Priya Sharma was exceptional. Very prompt, caring, and professional. My father Ramesh felt safe and well-attended to.',
    });
    console.log('Sample Review and Rating created...');

    console.log('Database seeding successfully finished!');
  } catch (error) {
    console.error(`Error with seeding data: ${error.message}`);
  }
};

// Auto-run when executed directly via CLI
if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  const runSeeder = async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eldercare-connect');
    await seedData();
    await mongoose.connection.close();
    process.exit(0);
  };
  runSeeder();
}

export default seedData;
