import sharp from 'sharp';
import { formatBytes, calculateSavingsPercentage } from '../utils/fileUtils.js';

/**
 * Resizes an image buffer using exact pixels or percentage scaling.
 *
 * @param {Buffer} inputBuffer - Original image buffer
 * @param {Object} options - Resize options
 * @param {string} options.resizeMode - 'pixels' | 'percentage'
 * @param {number} [options.targetWidth] - Desired width in pixels
 * @param {number} [options.targetHeight] - Desired height in pixels
 * @param {number} [options.percentage] - Scale percentage (e.g. 50 for 50%, 150 for 150%)
 * @param {boolean} [options.maintainAspectRatio=true] - Whether to lock aspect ratio
 * @param {boolean} [options.cleanBackground=false] - Whether to clean white paper background
 * @param {string} [options.fit='inside'] - Sharp fit mode: 'inside' | 'cover' | 'contain' | 'fill'
 * @param {number} [options.quality=85] - Output quality (1-100)
 * @param {string} [options.outputFormat='original'] - 'original' | 'jpeg' | 'png' | 'webp'
 * @param {string} [options.originalName='image.jpg'] - Original file name
 * @returns {Promise<Object>} Resized result with metadata and base64 Data URI
 */
export const resizeImageService = async (inputBuffer, options = {}) => {
  const originalSize = inputBuffer.length;
  let image = sharp(inputBuffer);
  const initialMetadata = await image.metadata();

  const origWidth = initialMetadata.width || 1000;
  const origHeight = initialMetadata.height || 1000;
  const origAspectRatio = origWidth / origHeight;

  let newWidth = origWidth;
  let newHeight = origHeight;

  const maintainAspectRatio = options.maintainAspectRatio !== false && options.maintainAspectRatio !== 'false';

  // Calculate new dimensions based on mode
  if (options.resizeMode === 'percentage') {
    const scale = (parseFloat(options.percentage) || 100) / 100;
    newWidth = Math.max(1, Math.round(origWidth * scale));
    newHeight = Math.max(1, Math.round(origHeight * scale));
  } else {
    // Pixels mode
    const reqWidth = options.targetWidth ? parseInt(options.targetWidth, 10) : null;
    const reqHeight = options.targetHeight ? parseInt(options.targetHeight, 10) : null;

    if (reqWidth && reqHeight) {
      if (maintainAspectRatio) {
        newWidth = reqWidth;
        newHeight = Math.round(reqWidth / origAspectRatio);
      } else {
        newWidth = reqWidth;
        newHeight = reqHeight;
      }
    } else if (reqWidth) {
      newWidth = reqWidth;
      newHeight = Math.round(reqWidth / origAspectRatio);
    } else if (reqHeight) {
      newHeight = reqHeight;
      newWidth = Math.round(reqHeight * origAspectRatio);
    }
  }

  // Determine output format
  let format = (options.outputFormat || 'original').toLowerCase();
  if (format === 'original' || !format) {
    format = (initialMetadata.format || 'jpeg').toLowerCase();
    if (format === 'jpg') format = 'jpeg';
  }

  const quality = Math.max(1, Math.min(100, parseInt(options.quality || 85, 10)));

  if (options.cleanBackground === true || options.cleanBackground === 'true') {
    image = image.normalize().linear(1.15, -15);
  }

  // Setup Sharp pipeline with Lanczos3 high-precision interpolation
  const fitMode = !maintainAspectRatio ? 'fill' : (options.fit || 'inside');
  let pipeline = image.resize({
    width: newWidth,
    height: newHeight,
    fit: fitMode,
    withoutEnlargement: false,
    kernel: sharp.kernel.lanczos3
  });

  // Apply format & quality
  if (format === 'png') {
    pipeline = pipeline.png({ quality, compressionLevel: 9, palette: true });
  } else if (format === 'webp') {
    pipeline = pipeline.webp({ quality, effort: 4 });
  } else {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  }

  const { data: finalBuffer, info: outputInfo } = await pipeline.toBuffer({ resolveWithObject: true });

  const finalSize = finalBuffer.length;
  const savingsPercent = calculateSavingsPercentage(originalSize, finalSize);
  const mimeType = `image/${format === 'jpeg' ? 'jpeg' : format}`;
  const base64DataUri = `data:${mimeType};base64,${finalBuffer.toString('base64')}`;

  const originalBaseName = (options.originalName || 'image').replace(/\.[^/.]+$/, '');
  const outputExtension = format === 'jpeg' ? 'jpg' : format;
  const outputFilename = `${originalBaseName}-${newWidth}x${newHeight}.${outputExtension}`;

  return {
    original: {
      name: options.originalName || 'image',
      sizeBytes: originalSize,
      formattedSize: formatBytes(originalSize),
      width: origWidth,
      height: origHeight,
      format: (initialMetadata.format || 'unknown').toUpperCase()
    },
    resized: {
      filename: outputFilename,
      sizeBytes: finalSize,
      formattedSize: formatBytes(finalSize),
      width: outputInfo.width,
      height: outputInfo.height,
      format: format.toUpperCase(),
      mimeType,
      qualityUsed: quality,
      savingsPercent,
      isEnlarged: finalSize > originalSize || outputInfo.width > origWidth || outputInfo.height > origHeight,
      dataUri: base64DataUri
    },
    meta: {
      mode: options.resizeMode || 'pixels',
      maintainAspectRatio,
      scalePercentage: options.resizeMode === 'percentage' ? options.percentage : null
    }
  };
};
