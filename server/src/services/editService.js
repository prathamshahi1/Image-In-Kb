import sharp from 'sharp';
import { formatBytes, calculateSavingsPercentage } from '../utils/fileUtils.js';

/**
 * Applies transformations (crop, rotate, flip horizontal/vertical) to an image.
 *
 * @param {Buffer} inputBuffer - Original image buffer
 * @param {Object} options - Edit options
 * @param {number} [options.rotation=0] - Degrees (90, 180, 270, etc.)
 * @param {boolean} [options.flipHorizontal=false] - Flop horizontally
 * @param {boolean} [options.flipVertical=false] - Flip vertically
 * @param {Object} [options.crop] - Crop coordinates
 * @param {number} [options.crop.x] - Left coordinate
 * @param {number} [options.crop.y] - Top coordinate
 * @param {number} [options.crop.width] - Crop width
 * @param {number} [options.crop.height] - Crop height
 * @param {string} [options.outputFormat='original'] - 'original' | 'jpeg' | 'png' | 'webp'
 * @param {number} [options.quality=85] - Output quality 1-100
 * @param {string} [options.originalName='image.jpg'] - Original file name
 * @returns {Promise<Object>} Processed result with metadata and base64 Data URI
 */
export const editImageService = async (inputBuffer, options = {}) => {
  const originalSize = inputBuffer.length;
  let pipeline = sharp(inputBuffer);
  const initialMetadata = await pipeline.metadata();

  const origWidth = initialMetadata.width || 1000;
  const origHeight = initialMetadata.height || 1000;

  // 1. Apply Rotation
  const rotation = parseInt(options.rotation || 0, 10);
  if (rotation !== 0) {
    const normalizedAngle = ((rotation % 360) + 360) % 360;
    if (normalizedAngle !== 0) {
      pipeline = pipeline.rotate(normalizedAngle);
    }
  }

  // 2. Apply Flips
  if (options.flipHorizontal) {
    pipeline = pipeline.flop();
  }
  if (options.flipVertical) {
    pipeline = pipeline.flip();
  }

  // 3. Apply Crop if specified
  if (options.crop && options.crop.width > 0 && options.crop.height > 0) {
    // If rotation occurred, we need the rotated dimensions first
    let currentWidth = origWidth;
    let currentHeight = origHeight;
    const normalizedAngle = ((rotation % 360) + 360) % 360;
    if (normalizedAngle === 90 || normalizedAngle === 270) {
      currentWidth = origHeight;
      currentHeight = origWidth;
    }

    const left = Math.max(0, Math.min(currentWidth - 1, Math.round(options.crop.x || 0)));
    const top = Math.max(0, Math.min(currentHeight - 1, Math.round(options.crop.y || 0)));
    const width = Math.min(currentWidth - left, Math.round(options.crop.width));
    const height = Math.min(currentHeight - top, Math.round(options.crop.height));

    if (width > 0 && height > 0) {
      pipeline = pipeline.extract({ left, top, width, height });
    }
  }

  // 4. Format & Quality
  let format = (options.outputFormat || 'original').toLowerCase();
  if (format === 'original' || !format) {
    format = (initialMetadata.format || 'jpeg').toLowerCase();
    if (format === 'jpg') format = 'jpeg';
  }

  const quality = Math.max(1, Math.min(100, parseInt(options.quality || 85, 10)));

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
  const outputFilename = `${originalBaseName}-edited.${outputExtension}`;

  return {
    original: {
      name: options.originalName || 'image',
      sizeBytes: originalSize,
      formattedSize: formatBytes(originalSize),
      width: origWidth,
      height: origHeight,
      format: (initialMetadata.format || 'unknown').toUpperCase()
    },
    edited: {
      filename: outputFilename,
      sizeBytes: finalSize,
      formattedSize: formatBytes(finalSize),
      width: outputInfo.width,
      height: outputInfo.height,
      format: format.toUpperCase(),
      mimeType,
      qualityUsed: quality,
      savingsPercent,
      dataUri: base64DataUri
    },
    operations: {
      rotation,
      flipHorizontal: !!options.flipHorizontal,
      flipVertical: !!options.flipVertical,
      cropApplied: !!options.crop
    }
  };
};
