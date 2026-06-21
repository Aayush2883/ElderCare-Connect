import Service from '../models/Service.js';

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Admin Only)
export const createService = async (req, res, next) => {
  try {
    const { serviceName, description, duration, price, requiredQualification } = req.body;

    const serviceExists = await Service.findOne({ serviceName });

    if (serviceExists) {
      res.status(400);
      throw new Error('Service with this name already exists');
    }

    const service = await Service.create({
      serviceName,
      description,
      duration,
      price,
      requiredQualification,
    });

    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    res.json(service);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Admin Only)
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedService);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Admin Only)
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service removed' });
  } catch (error) {
    next(error);
  }
};
