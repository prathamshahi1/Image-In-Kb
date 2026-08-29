import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { inMemoryUsers } from '../middleware/authMiddleware.js';
import { isDBReady } from '../config/db.js';
import { STATUS_CODES } from '../config/constants.js';

/**
 * Generate a signed JWT token.
 *
 * @param {string} id - User ID
 * @returns {string} Signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'imageinkb_secret', {
    expiresIn: '30d'
  });
};

// Seed demo user in fallback memory store
const DEMO_USER_ID = 'demo_user_65f01234abcd567890123456';
inMemoryUsers.set(DEMO_USER_ID, {
  _id: DEMO_USER_ID,
  id: DEMO_USER_ID,
  name: 'Demo Creator',
  email: 'demo@imageinkb.com',
  passwordHash: bcrypt.hashSync('password123', 10),
  createdAt: new Date('2026-01-01T00:00:00.000Z')
});

/**
 * Register a new user.
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'Please provide name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        error: 'PASSWORD_TOO_SHORT',
        message: 'Password must be at least 6 characters.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDBReady()) {
      try {
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
          return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            error: 'USER_EXISTS',
            message: 'An account with this email address already exists.'
          });
        }

        const user = await User.create({
          name,
          email: normalizedEmail,
          password
        });

        const token = generateToken(user._id);

        return res.status(STATUS_CODES.CREATED).json({
          success: true,
          message: 'Account created successfully.',
          data: {
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              createdAt: user.createdAt
            },
            token
          }
        });
      } catch (dbError) {
        console.warn('DB error on register, falling back to memory store:', dbError.message);
      }
    }

    // In-memory store logic
    for (const [, u] of inMemoryUsers.entries()) {
      if (u.email === normalizedEmail) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: 'USER_EXISTS',
          message: 'An account with this email address already exists.'
        });
      }
    }

    const newId = `user_${Date.now()}`;
    const newUser = {
      _id: newId,
      id: newId,
      name,
      email: normalizedEmail,
      passwordHash: bcrypt.hashSync(password, 10),
      createdAt: new Date()
    };

    inMemoryUsers.set(newId, newUser);
    const token = generateToken(newId);

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        user: {
          id: newId,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user & return JWT token.
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        error: 'MISSING_CREDENTIALS',
        message: 'Please provide both email and password.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDBReady()) {
      try {
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (user && (await user.matchPassword(password))) {
          const token = generateToken(user._id);
          return res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Logged in successfully.',
            data: {
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
              },
              token
            }
          });
        }
      } catch (dbError) {
        console.warn('DB error on login, falling back to memory store:', dbError.message);
      }
    }

    // Check fallback memory store (includes Demo account)
    for (const [, u] of inMemoryUsers.entries()) {
      if (u.email === normalizedEmail) {
        if (bcrypt.compareSync(password, u.passwordHash)) {
          const token = generateToken(u._id || u.id);
          return res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Logged in successfully.',
            data: {
              user: {
                id: u._id || u.id,
                name: u.name,
                email: u.email,
                createdAt: u.createdAt || new Date()
              },
              token
            }
          });
        }
      }
    }

    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current logged in user profile.
 */
export const getMe = async (req, res, next) => {
  try {
    return res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        user: {
          id: req.user._id || req.user.id,
          name: req.user.name,
          email: req.user.email,
          createdAt: req.user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
