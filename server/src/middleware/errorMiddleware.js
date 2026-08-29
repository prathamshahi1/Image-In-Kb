import multer from 'multer';
import { STATUS_CODES } from '../config/constants.js';

export const notFoundHandler = (req, res, next) => {
  res.status(STATUS_CODES.NOT_FOUND).json({
    success: false,
    message: `Resource not found at ${req.originalUrl}`
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('[Error Details]:', err);

  // Handle Multer limits
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        error: 'FILE_TOO_LARGE',
        message: 'File size exceeds maximum allowed limit of 25MB.'
      });
    }
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      error: err.code,
      message: err.message
    });
  }

  // Handle custom validation errors
  if (err.code === 'UNSUPPORTED_FILE_TYPE') {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      error: 'UNSUPPORTED_FILE_TYPE',
      message: err.message
    });
  }

  // Handle general/Sharp errors
  const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'SERVER_ERROR',
    message: err.message || 'An unexpected error occurred while processing your image.'
  });
};
