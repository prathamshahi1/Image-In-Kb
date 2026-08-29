import History from '../models/History.js';
import { formatBytes, calculateSavingsPercentage } from '../utils/fileUtils.js';
import { isDBReady } from '../config/db.js';
import { STATUS_CODES } from '../config/constants.js';

// In-memory history store fallback
export const inMemoryHistory = [];

/**
 * Utility to record an entry in processing history.
 *
 * @param {Object} params
 */
export const recordHistoryEntry = async ({
  userId,
  filename,
  operation,
  originalSizeBytes,
  finalSizeBytes,
  savingsPercent,
  outputFormat,
  status = 'SUCCESS'
}) => {
  if (!userId) return;

  const entry = {
    userId,
    filename,
    operation: operation.toUpperCase(),
    originalSizeBytes,
    finalSizeBytes,
    savingsPercent: savingsPercent || 0,
    outputFormat: outputFormat ? outputFormat.toUpperCase() : 'JPG',
    status,
    createdAt: new Date()
  };

  if (isDBReady()) {
    try {
      await History.create(entry);
      return;
    } catch (err) {
      // Fallback to memory
    }
  }

  // Save to in-memory fallback
  entry._id = `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  inMemoryHistory.unshift(entry);
};

/**
 * Get all history records for the current user.
 */
export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let historyList = [];

    if (isDBReady()) {
      try {
        historyList = await History.find({ userId }).sort({ createdAt: -1 }).limit(100);
      } catch (err) {
        historyList = inMemoryHistory.filter((item) => String(item.userId) === String(userId));
      }
    } else {
      historyList = inMemoryHistory.filter((item) => String(item.userId) === String(userId));
    }

    const formattedHistory = historyList.map((item) => ({
      id: item._id,
      filename: item.filename,
      operation: item.operation,
      originalSize: formatBytes(item.originalSizeBytes),
      finalSize: formatBytes(item.finalSizeBytes),
      originalSizeBytes: item.originalSizeBytes,
      finalSizeBytes: item.finalSizeBytes,
      savingsPercent: item.savingsPercent,
      outputFormat: item.outputFormat,
      status: item.status,
      date: item.createdAt
    }));

    return res.status(STATUS_CODES.OK).json({
      success: true,
      count: formattedHistory.length,
      data: formattedHistory
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get aggregated processing statistics for the dashboard.
 */
export const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let historyList = [];

    if (isDBReady()) {
      try {
        historyList = await History.find({ userId });
      } catch (err) {
        historyList = inMemoryHistory.filter((item) => String(item.userId) === String(userId));
      }
    } else {
      historyList = inMemoryHistory.filter((item) => String(item.userId) === String(userId));
    }

    let totalOriginalBytes = 0;
    let totalFinalBytes = 0;
    let totalSavingsSum = 0;

    for (const item of historyList) {
      totalOriginalBytes += item.originalSizeBytes || 0;
      totalFinalBytes += item.finalSizeBytes || 0;
      totalSavingsSum += item.savingsPercent || 0;
    }

    const totalSavedBytes = Math.max(0, totalOriginalBytes - totalFinalBytes);
    const averageCompression = historyList.length > 0
      ? Number((totalSavingsSum / historyList.length).toFixed(1))
      : 0;

    return res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        imagesProcessed: historyList.length,
        totalOriginalSize: formatBytes(totalOriginalBytes),
        totalOriginalBytes,
        totalFinalSize: formatBytes(totalFinalBytes),
        totalSavedSize: formatBytes(totalSavedBytes),
        totalSavedBytes,
        averageCompression
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a specific history item.
 */
export const deleteHistoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (isDBReady()) {
      try {
        await History.findOneAndDelete({ _id: id, userId });
      } catch (err) {
        const idx = inMemoryHistory.findIndex((item) => String(item._id) === String(id));
        if (idx !== -1) {
          inMemoryHistory.splice(idx, 1);
        }
      }
    } else {
      const idx = inMemoryHistory.findIndex((item) => String(item._id) === String(id));
      if (idx !== -1) {
        inMemoryHistory.splice(idx, 1);
      }
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'History item removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};
