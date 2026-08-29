import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', registerUser);

// POST /api/auth/login - Login user & return token
router.post('/login', loginUser);

// GET /api/auth/me - Get current user profile (Protected)
router.get('/me', protect, getMe);

export default router;
