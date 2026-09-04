/**
 * Global Error Handling Middleware
 * Ownership: Member 2 (Backend API & Auth)
 * 
 * Intercepts Mongoose validation errors and unhandled exceptions,
 * converting them into friendly, readable JSON responses for the frontend.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${err.name || 'Error'}: ${err.message}`);

  // Mongoose validation error handling
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
      errors: messages,
    });
  }

  // Duplicate key error handling (e.g. unique username)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `The ${field} "${err.keyValue[field]}" is already taken. Please choose another.`,
    });
  }

  // Cast error (e.g. invalid MongoDB ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid identifier format for ${err.path}.`,
    });
  }

  // Default internal server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred. Please try again.',
  });
};

module.exports = errorHandler;
