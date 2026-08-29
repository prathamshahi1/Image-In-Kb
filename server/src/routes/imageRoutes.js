import express from 'express';
import { uploadSingle, uploadMultiple } from '../middleware/uploadMiddleware.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import {
  inspectImage,
  compressImage,
  resizeImage,
  convertImage,
  editImage,
  processBatch
} from '../controllers/imageController.js';

const router = express.Router();

// Apply optionalAuth to extract req.user when user is logged in
router.use(optionalAuth);

// POST /api/images/inspect - Upload single image and get verified Sharp metadata
router.post('/inspect', uploadSingle, inspectImage);

// POST /api/images/compress - Compress image to target KB, range, or custom quality
router.post('/compress', uploadSingle, compressImage);

// POST /api/images/resize - Resize image by pixels or percentage
router.post('/resize', uploadSingle, resizeImage);

// POST /api/images/convert - Convert image format (JPG, PNG, WEBP)
router.post('/convert', uploadSingle, convertImage);

// POST /api/images/edit - Crop, rotate, and flip image
router.post('/edit', uploadSingle, editImage);

// POST /api/images/process-batch - Process multiple images and export as ZIP
router.post('/process-batch', uploadMultiple, processBatch);

export default router;
