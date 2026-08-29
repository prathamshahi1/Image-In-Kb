import { inspectImageMetadata } from '../services/imageService.js';
import { compressImageService } from '../services/compressionService.js';
import { resizeImageService } from '../services/resizeService.js';
import { convertImageService } from '../services/conversionService.js';
import { editImageService } from '../services/editService.js';
import { processBatchService } from '../services/batchService.js';
import { recordHistoryEntry } from './historyController.js';
import { STATUS_CODES } from '../config/constants.js';

/**
 * Controller to inspect uploaded image file and return detailed Sharp metadata.
 */
export const inspectImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        error: 'NO_FILE_PROVIDED',
        message: 'No image file was provided in the request.'
      });
    }

    const metadata = await inspectImageMetadata(
      req.file.buffer,
      req.file.originalname,
      req.file.size
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Image verified and metadata extracted successfully.',
      data: metadata
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to compress/expand uploaded image to target KB, custom range, or manual quality.
 */
export const compressImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        error: 'NO_FILE_PROVIDED',
        message: 'No image file was uploaded for compression.'
      });
    }

    const {
      targetMode = 'target_size',
      targetSizeKb = 100,
      minSizeKb = 50,
      maxSizeKb = 100,
      manualQuality = 80,
      outputFormat = 'original',
      padToTarget,
      cleanBackground,
      exactTargetSize
    } = req.body;

    const result = await compressImageService(req.file.buffer, {
      targetMode,
      targetSizeKb,
      minSizeKb,
      maxSizeKb,
      manualQuality,
      outputFormat,
      padToTarget: padToTarget === 'true' || padToTarget === true,
      cleanBackground: cleanBackground === 'true' || cleanBackground === true,
      exactTargetSize: exactTargetSize === 'true' || exactTargetSize === true,
      originalName: req.file.originalname
    });

    // Auto-record history if user is logged in
    if (req.user) {
      await recordHistoryEntry({
        userId: req.user._id || req.user.id,
        filename: req.file.originalname,
        operation: 'COMPRESS',
        originalSizeBytes: result.original.sizeBytes,
        finalSizeBytes: result.compressed.sizeBytes,
        savingsPercent: result.compressed.savingsPercent,
        outputFormat: result.compressed.format
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Image compressed successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to resize uploaded image by pixels or percentage.
 */
export const resizeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        error: 'NO_FILE_PROVIDED',
        message: 'No image file was uploaded for resizing.'
      });
    }

    const {
      resizeMode = 'pixels',
      targetWidth,
      targetHeight,
      percentage,
      maintainAspectRatio = true,
      quality = 85,
      outputFormat = 'original',
      cleanBackground
    } = req.body;

    const result = await resizeImageService(req.file.buffer, {
      resizeMode,
      targetWidth,
      targetHeight,
      percentage,
      maintainAspectRatio,
      quality,
      outputFormat,
      cleanBackground: cleanBackground === 'true' || cleanBackground === true,
      originalName: req.file.originalname
    });

    if (req.user) {
      await recordHistoryEntry({
        userId: req.user._id || req.user.id,
        filename: req.file.originalname,
        operation: 'RESIZE',
        originalSizeBytes: result.original.sizeBytes,
        finalSizeBytes: result.resized.sizeBytes,
        savingsPercent: result.resized.savingsPercent,
        outputFormat: result.resized.format
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Image resized successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to convert uploaded image format.
 */
export const convertImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        error: 'NO_FILE_PROVIDED',
        message: 'No image file was uploaded for conversion.'
      });
    }

    const {
      targetFormat = 'webp',
      quality = 85
    } = req.body;

    const result = await convertImageService(req.file.buffer, {
      targetFormat,
      quality,
      originalName: req.file.originalname
    });

    if (req.user) {
      await recordHistoryEntry({
        userId: req.user._id || req.user.id,
        filename: req.file.originalname,
        operation: 'CONVERT',
        originalSizeBytes: result.original.sizeBytes,
        finalSizeBytes: result.converted.sizeBytes,
        savingsPercent: result.converted.savingsPercent,
        outputFormat: result.converted.format
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Image converted successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to edit image (crop, rotate, flip horizontal/vertical).
 */
export const editImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        error: 'NO_FILE_PROVIDED',
        message: 'No image file was uploaded for editing.'
      });
    }

    let crop = null;
    if (req.body.crop) {
      crop = typeof req.body.crop === 'string' ? JSON.parse(req.body.crop) : req.body.crop;
    }

    const result = await editImageService(req.file.buffer, {
      rotation: req.body.rotation,
      flipHorizontal: req.body.flipHorizontal === 'true' || req.body.flipHorizontal === true,
      flipVertical: req.body.flipVertical === 'true' || req.body.flipVertical === true,
      crop,
      outputFormat: req.body.outputFormat,
      quality: req.body.quality,
      originalName: req.file.originalname
    });

    if (req.user) {
      await recordHistoryEntry({
        userId: req.user._id || req.user.id,
        filename: req.file.originalname,
        operation: 'EDIT',
        originalSizeBytes: result.original.sizeBytes,
        finalSizeBytes: result.edited.sizeBytes,
        savingsPercent: result.edited.savingsPercent,
        outputFormat: result.edited.format
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Image edited successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for batch image processing with ZIP download.
 */
export const processBatch = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        error: 'NO_FILES_PROVIDED',
        message: 'No image files were uploaded for batch processing.'
      });
    }

    const result = await processBatchService(req.files, req.body);

    if (req.user) {
      await recordHistoryEntry({
        userId: req.user._id || req.user.id,
        filename: `Batch (${result.totalFiles} images)`,
        operation: 'BATCH',
        originalSizeBytes: result.totalOriginalBytes,
        finalSizeBytes: result.totalProcessedBytes,
        savingsPercent: result.totalSavingsPercent,
        outputFormat: 'ZIP'
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: `Batch processed ${result.successfulFiles} of ${result.totalFiles} images successfully.`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
