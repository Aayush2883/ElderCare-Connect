import rateLimit from 'express-rate-limit';

/**
 * Rate limiter middleware for verification endpoints (email verification and resending).
 * Limits each IP address to 5 requests per 15-minute window.
 * Integrates with global Express error handling middleware for consistent JSON responses.
 */
export const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(options.statusCode || 429);
    next(new Error(options.message));
  },
});
