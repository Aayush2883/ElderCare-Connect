import Patient from '../models/Patient.js';

// @desc    Create a patient profile
// @route   POST /api/patients
// @access  Private (User/Admin)
export const createPatient = async (req, res, next) => {
  try {
    const { patientName, age, gender, address, medicalNeeds, emergencyContact } = req.body;

    const patient = await Patient.create({
      userId: req.user._id,
      patientName,
      age,
      gender,
      address,
      medicalNeeds,
      emergencyContact,
    });

    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
export const getPatients = async (req, res, next) => {
  try {
    let query = {};

    // Users can only view patients they created; Admins can see all.
    // Caregivers can see patients if they have a booking (we'll allow caregivers to read patient files for their bookings too)
    if (req.user.role === 'user') {
      query.userId = req.user._id;
    }

    const patients = await Patient.find(query).populate('userId', 'name email phone');
    res.json(patients);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single patient by ID
// @route   GET /api/patients/:id
// @access  Private
export const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'name email phone');

    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }

    // Auth check: Owner, Caregiver, or Admin
    if (req.user.role === 'user' && patient.userId._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view this patient profile');
    }

    res.json(patient);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a patient profile
// @route   PUT /api/patients/:id
// @access  Private (Owner/Admin)
export const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }

    if (req.user.role !== 'admin' && patient.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to edit this patient profile');
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedPatient);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a patient profile
// @route   DELETE /api/patients/:id
// @access  Private (Owner/Admin)
export const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }

    if (req.user.role !== 'admin' && patient.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this patient profile');
    }

    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient profile removed' });
  } catch (error) {
    next(error);
  }
};
