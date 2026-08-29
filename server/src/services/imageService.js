import sharp from 'sharp';
import { formatBytes } from '../utils/fileUtils.js';

/**
 * Extracts and inspects metadata from an image buffer using Sharp.
 * Validates the image structure to ensure it is not corrupt or invalid.
 *
 * @param {Buffer} buffer - Image file buffer
 * @param {string} originalName - Original uploaded file name
 * @param {number} size - Original size in bytes
 * @returns {Promise<Object>} Formatted image metadata object
 */
export const inspectImageMetadata = async (buffer, originalName, size) => {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    const aspectRatio = metadata.width && metadata.height 
      ? (metadata.width / metadata.height).toFixed(2) 
      : '1.00';

    return {
      name: originalName,
      format: metadata.format ? metadata.format.toUpperCase() : 'UNKNOWN',
      width: metadata.width || 0,
      height: metadata.height || 0,
      aspectRatio: Number(aspectRatio),
      channels: metadata.channels || 3,
      hasAlpha: metadata.hasAlpha || false,
      space: metadata.space || 'srgb',
      density: metadata.density || 72,
      isProgressive: metadata.isProgressive || false,
      sizeBytes: size,
      formattedSize: formatBytes(size),
      mimeType: `image/${metadata.format === 'jpeg' ? 'jpeg' : metadata.format}`
    };
  } catch (error) {
    throw new Error(`Failed to parse image file: ${error.message}`);
  }
};
