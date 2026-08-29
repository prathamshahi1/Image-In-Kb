import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { STATUS_CODES } from '../config/constants.js';

// In-memory user store fallback for local development when MongoDB is offline
export const inMemoryUsers = new Map();

/**
 * Middleware to require JWT authentication.
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'imageforge_secret');

      // Check if user in database or fallback memory store
      let user = null;
      try {
        user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        user = inMemoryUsers.get(decoded.id);
      }

      if (!user) {
        user = inMemoryUsers.get(decoded.id);
      }

      if (!user) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          error: 'NOT_AUTHORIZED',
          message: 'User belonging to this token no longer exists.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        error: 'TOKEN_INVALID',
        message: 'Not authorized. Token is invalid or expired.'
      });
    }
  }

  if (!token) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      error: 'NO_TOKEN',
      message: 'Not authorized. No Bearer token provided.'
    });
  }
};

/**
 * Optional Auth middleware: attaches user if token present, otherwise proceeds as guest.
 */
export const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'imageforge_secret');
      
      let user = null;
      try {
        user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        user = inMemoryUsers.get(decoded.id);
      }

      if (!user) {
        user = inMemoryUsers.get(decoded.id);
      }

      if (user) {
        req.user = user;
      }
    } catch (err) {
      // Ignore token errors in optional auth mode
    }
  }
  next();
};
