import express from 'express';
import { getHistory, getStats, deleteHistoryItem } from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All history routes require authentication
router.use(protect);

// GET /api/history - Get user processing history
router.get('/', getHistory);

// GET /api/history/stats - Get aggregated analytics
router.get('/stats', getStats);

// DELETE /api/history/:id - Delete history record
router.delete('/:id', deleteHistoryItem);

export default router;
