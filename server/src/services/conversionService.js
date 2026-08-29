import sharp from 'sharp';
import { formatBytes, calculateSavingsPercentage } from '../utils/fileUtils.js';

/**
 * Converts an image between JPG, PNG, and WEBP with quality options.
 *
 * @param {Buffer} inputBuffer - Original image buffer
 * @param {Object} options - Conversion options
 * @param {string} options.targetFormat - 'jpeg' | 'jpg' | 'png' | 'webp'
 * @param {number} [options.quality=85] - Output quality 1-100
 * @param {string} [options.originalName='image.jpg'] - Original file name
 * @returns {Promise<Object>} Converted result with metadata and base64 Data URI
 */
export const convertImageService = async (inputBuffer, options = {}) => {
  const originalSize = inputBuffer.length;
  const image = sharp(inputBuffer);
  const initialMetadata = await image.metadata();

  let targetFormat = (options.targetFormat || 'webp').toLowerCase();
  if (targetFormat === 'jpg') targetFormat = 'jpeg';

  const quality = Math.max(1, Math.min(100, parseInt(options.quality || 85, 10)));

  let pipeline = sharp(inputBuffer);

  if (targetFormat === 'png') {
    pipeline = pipeline.png({
      quality,
      compressionLevel: 9,
      effort: 7,
      palette: true
    });
  } else if (targetFormat === 'webp') {
    pipeline = pipeline.webp({
      quality,
      effort: 4
    });
  } else {
    pipeline = pipeline.jpeg({
      quality,
      mozjpeg: true
    });
  }

  const { data: finalBuffer, info: outputInfo } = await pipeline.toBuffer({ resolveWithObject: true });

  const finalSize = finalBuffer.length;
  const savingsPercent = calculateSavingsPercentage(originalSize, finalSize);
  const mimeType = `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`;
  const base64DataUri = `data:${mimeType};base64,${finalBuffer.toString('base64')}`;

  const originalBaseName = (options.originalName || 'image').replace(/\.[^/.]+$/, '');
  const outputExtension = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
  const outputFilename = `${originalBaseName}-converted.${outputExtension}`;

  return {
    original: {
      name: options.originalName || 'image',
      sizeBytes: originalSize,
      formattedSize: formatBytes(originalSize),
      width: initialMetadata.width || 0,
      height: initialMetadata.height || 0,
      format: (initialMetadata.format || 'unknown').toUpperCase()
    },
    converted: {
      filename: outputFilename,
      sizeBytes: finalSize,
      formattedSize: formatBytes(finalSize),
      width: outputInfo.width,
      height: outputInfo.height,
      format: targetFormat.toUpperCase(),
      mimeType,
      qualityUsed: quality,
      savingsPercent,
      dataUri: base64DataUri
    }
  };
};
