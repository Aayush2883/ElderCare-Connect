import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Caregiver from '../models/Caregiver.js';
import { sendVerificationEmail, sendWelcomeEmail, isEmailServiceConfigured } from '../services/emailService.js';
import { getUploadedFilePath } from '../utils/fileHelper.js';

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user / caregiver / admin
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, specialization, experience, serviceArea, hourlyRate } = req.body;

    if (role === 'caregiver') {
      if (!specialization || !experience || !serviceArea || !hourlyRate) {
        res.status(400);
        throw new Error('Please fill in all caregiver fields (specialization, experience, serviceArea, hourlyRate)');
      }
      if (!req.file) {
        res.status(400);
        throw new Error('Please upload a profile photo');
      }
    }

    const isGoogleEmail = email && (email.toLowerCase().endsWith('@gmail.com') || email.toLowerCase().endsWith('@googlemail.com'));

    if (!isGoogleEmail) {
      if (!isEmailServiceConfigured()) {
        res.status(400);
        throw new Error('Email is not correct');
      }
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email is already registered');
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      res.status(400);
      throw new Error('Phone number is already registered');
    }

    const verificationToken = isGoogleEmail ? undefined : crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = isGoogleEmail ? undefined : Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'user',
      emailVerified: isGoogleEmail ? true : false,
      verificationToken,
      verificationTokenExpiry,
    });

    if (user) {
      // If role is caregiver, create their profile entry with default values
      if (user.role === 'caregiver') {
        const profilePhotoPath = req.file ? getUploadedFilePath(req.file) : '';
        await Caregiver.create({
          userId: user._id,
          specialization,
          experience: Number(experience),
          serviceArea,
          hourlyRate: Number(hourlyRate),
          availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          verificationStatus: 'pending',
          profilePhoto: profilePhotoPath,
          qualification: '',
          degreeDocument: '',
        });
      }

      if (isGoogleEmail) {
        // Send welcome email directly for Google verified registrations
        sendWelcomeEmail(user).catch((err) => {
          console.error(`Failed to send welcome email for Google user: ${err.message}`);
        });
      } else {
        // Send verification email asynchronously for standard registrations
        sendVerificationEmail(user, verificationToken).catch((err) => {
          console.error(`Failed to send verification email during registration: ${err.message}`);
        });
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile details
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      let extraData = {};

      if (user.role === 'caregiver') {
        const caregiverProfile = await Caregiver.findOne({ userId: user._id });
        extraData = { caregiverProfile };
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        ...extraData,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private (Admin Only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin Only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify user email using verification token
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Retrieve user and explicitly select verification fields as they are select: false
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    }).select('+verificationToken +verificationTokenExpiry');

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired verification token');
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    // Send welcome email asynchronously
    sendWelcomeEmail(user).catch((err) => {
      console.error(`Failed to send welcome email to ${user.email}: ${err.message}`);
    });

    res.json({
      success: true,
      message: 'Email verified successfully. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend email verification token
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select('+verificationToken +verificationTokenExpiry');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.emailVerified) {
      res.status(400);
      throw new Error('Email is already verified');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Send verification email asynchronously
    sendVerificationEmail(user, verificationToken).catch((err) => {
      console.error(`Failed to send verification email: ${err.message}`);
    });

    res.json({
      success: true,
      message: 'Verification email has been resent. Please check your inbox.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload caregiver degree/qualification document (PDF)
// @route   POST /api/auth/upload-degree
// @access  Private (Authenticated Caregivers)
export const uploadDegree = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a qualification document (PDF format)');
    }

    const caregiver = await Caregiver.findOne({ userId: req.user._id });

    if (!caregiver) {
      res.status(404);
      throw new Error('Caregiver profile not found');
    }

    caregiver.degreeDocument = getUploadedFilePath(req.file);
    caregiver.qualification = 'Degree Uploaded';
    caregiver.verificationStatus = 'pending';
    await caregiver.save();

    res.json({
      success: true,
      message: 'Degree document uploaded successfully.',
      degreeDocument: caregiver.degreeDocument,
    });
  } catch (error) {
    next(error);
  }
};

