/**
 * Input Validation Middleware for Authentication Routes.
 */

// Email regex validation helper
const validateEmailFormat = (email) => {
  const emailRegex = /^\underline{w}+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  // Wait, let's use the same standard regex from Mongoose:
  const mongooseEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return mongooseEmailRegex.test(email);
};

// Indian Phone Number regex validation helper
const validateIndianPhone = (phone) => {
  // Matches:
  // - Optional prefix: +91, 91, or 0
  // - Optional space or dash separator
  // - 10 digits starting with 6, 7, 8, or 9
  const phoneRegex = /^(?:\+91|91|0)?[\s\-]?[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates request body for User Registration
 */
export const validateRegisterInput = (req, res, next) => {
  const { name, email, phone, password } = req.body;
  const errors = [];

  // Name Validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required and must be a valid string');
  }

  // Email Validation
  if (!email) {
    errors.push('Email is required');
  } else if (!validateEmailFormat(email)) {
    errors.push('Invalid email format');
  }

  // Phone Validation
  if (!phone) {
    errors.push('Phone number is required');
  } else if (!validateIndianPhone(phone)) {
    errors.push('Invalid phone number. Must be a valid Indian phone number starting with 6-9');
  }

  // Password Validation
  if (!password) {
    errors.push('Password is required');
  } else if (typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join('. ')));
  }

  next();
};

/**
 * Validates request body for Resending Verification Email
 */
export const validateResendInput = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    return next(new Error('Email is required'));
  }

  if (!validateEmailFormat(email)) {
    res.status(400);
    return next(new Error('Invalid email format'));
  }

  next();
};
