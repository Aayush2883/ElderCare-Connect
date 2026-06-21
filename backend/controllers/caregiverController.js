import Caregiver from '../models/Caregiver.js';
import User from '../models/User.js';
import { getUploadedFilePath } from '../utils/fileHelper.js';

// @desc    Create or update caregiver profile (for logged in caregiver)
// @route   POST /api/caregivers
// @access  Private (Caregiver)
export const upsertCaregiverProfile = async (req, res, next) => {
  try {
    const { specialization, qualification, experience, serviceArea, availability, hourlyRate } = req.body;

    let profilePhotoPath = req.body.profilePhoto;
    if (req.files && req.files['profilePhoto'] && req.files['profilePhoto'][0]) {
      profilePhotoPath = getUploadedFilePath(req.files['profilePhoto'][0]);
    }

    let degreeDocumentPath = req.body.degreeDocument;
    if (req.files && req.files['degreeDocument'] && req.files['degreeDocument'][0]) {
      degreeDocumentPath = getUploadedFilePath(req.files['degreeDocument'][0]);
    }

    let availabilityArray = availability;
    if (typeof availability === 'string') {
      try {
        availabilityArray = JSON.parse(availability);
      } catch (err) {
        availabilityArray = availability.split(',').map(d => d.trim()).filter(Boolean);
      }
    }

    let caregiver = await Caregiver.findOne({ userId: req.user._id });

    if (caregiver) {
      // Update
      const updateData = {
        specialization,
        qualification,
        experience: Number(experience),
        serviceArea,
        hourlyRate: Number(hourlyRate),
      };

      if (profilePhotoPath !== undefined) {
        updateData.profilePhoto = profilePhotoPath;
      }
      if (degreeDocumentPath !== undefined) {
        updateData.degreeDocument = degreeDocumentPath;
      }
      if (availabilityArray !== undefined) {
        updateData.availability = availabilityArray;
      }

      caregiver = await Caregiver.findOneAndUpdate(
        { userId: req.user._id },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } else {
      // Create
      caregiver = await Caregiver.create({
        userId: req.user._id,
        specialization,
        qualification,
        experience: Number(experience),
        serviceArea,
        hourlyRate: Number(hourlyRate),
        availability: availabilityArray || [],
        profilePhoto: profilePhotoPath || '',
        degreeDocument: degreeDocumentPath || '',
        verificationStatus: 'pending',
      });
    }

    res.json(caregiver);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all caregivers with filters (e.g. specialization, verificationStatus)
// @route   GET /api/caregivers
// @access  Public
export const getCaregivers = async (req, res, next) => {
  try {
    const { specialization, verificationStatus, serviceArea } = req.query;
    let query = {};

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    if (serviceArea) {
      query.serviceArea = { $regex: serviceArea, $options: 'i' };
    }
    if (verificationStatus) {
      query.verificationStatus = verificationStatus;
    } else {
      // By default, public should only see verified caregivers
      // Unless it is an admin querying them. We will allow matching if passed or verify in caller.
      // If user is not admin, only show verified ones.
      if (!req.user || req.user.role !== 'admin') {
        query.verificationStatus = 'verified';
      }
    }

    const caregivers = await Caregiver.find(query).populate('userId', 'name email phone');
    res.json(caregivers);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single caregiver by ID
// @route   GET /api/caregivers/:id
// @access  Public
export const getCaregiverById = async (req, res, next) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id).populate('userId', 'name email phone');

    if (!caregiver) {
      res.status(404);
      throw new Error('Caregiver not found');
    }

    res.json(caregiver);
  } catch (error) {
    next(error);
  }
};

// @desc    Update caregiver profile details (by caregiver themselves or admin)
// @route   PUT /api/caregivers/:id
// @access  Private (Owner/Admin)
export const updateCaregiver = async (req, res, next) => {
  try {
    let caregiver = await Caregiver.findById(req.params.id);

    if (!caregiver) {
      res.status(404);
      throw new Error('Caregiver not found');
    }

    // Auth check: Admin or the caregiver who owns the profile
    if (req.user.role !== 'admin' && caregiver.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this caregiver profile');
    }

    // We do not allow standard users/caregivers to update verificationStatus or rating here
    const { verificationStatus, rating, totalReviews, ...updateData } = req.body;

    // Admin can update status
    if (req.user.role === 'admin' && verificationStatus) {
      updateData.verificationStatus = verificationStatus;
    }

    const updatedCaregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone');

    res.json(updatedCaregiver);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or reject a caregiver profile
// @route   PUT /api/caregivers/:id/verify
// @access  Private (Admin Only)
export const verifyCaregiver = async (req, res, next) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'

    if (!['verified', 'rejected', 'pending'].includes(status)) {
      res.status(400);
      throw new Error('Invalid verification status');
    }

    const caregiver = await Caregiver.findById(req.params.id);

    if (!caregiver) {
      res.status(404);
      throw new Error('Caregiver not found');
    }

    caregiver.verificationStatus = status;
    await caregiver.save();

    res.json({
      message: `Caregiver status updated to ${status}`,
      caregiver,
    });
  } catch (error) {
    next(error);
  }
};
