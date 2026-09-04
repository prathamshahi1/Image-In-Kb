import sharp from 'sharp';
import { crc32 } from 'zlib';
import { formatBytes, calculateSavingsPercentage } from '../utils/fileUtils.js';

/**
 * Safely pads an image buffer to reach a target file size in bytes
 * without corrupting the visual image or failing standard decoders.
 *
 * @param {Buffer} buffer - Image buffer
 * @param {string} format - Image format ('jpeg', 'png', 'webp')
 * @param {number} targetBytes - Target size in bytes
 * @returns {Buffer} Padded image buffer
 */
export const padBufferToTarget = (buffer, format, targetBytes) => {
  if (!buffer || buffer.length >= targetBytes) return buffer;
  const needed = targetBytes - buffer.length;
  const fmt = (format || '').toLowerCase();

  try {
    // 1. JPEG format padding using standard ISO COM (Comment 0xFF 0xFE) segments
    if (fmt === 'jpeg' || fmt === 'jpg') {
      if (needed < 4) {
        // If 1-3 bytes, append before EOI
        const eoiIndex = buffer.length - 2;
        return Buffer.concat([
          buffer.subarray(0, eoiIndex),
          Buffer.alloc(needed, 0x00),
          buffer.subarray(eoiIndex)
        ]);
      }

      let remaining = needed;
      const chunks = [];
      const eoiIndex = buffer.length - 2;
      chunks.push(buffer.subarray(0, eoiIndex));

      while (remaining > 0) {
        if (remaining < 4) {
          chunks.push(Buffer.alloc(remaining, 0x00));
          remaining = 0;
          break;
        }
        const segmentPayload = Math.min(remaining - 4, 65533);
        const segmentLength = segmentPayload + 2;
        const header = Buffer.alloc(4);
        header[0] = 0xFF;
        header[1] = 0xFE;
        header[2] = (segmentLength >> 8) & 0xFF;
        header[3] = segmentLength & 0xFF;
        const payload = Buffer.alloc(segmentPayload, 0x00);
        chunks.push(header, payload);
        remaining -= (segmentPayload + 4);
      }

      chunks.push(buffer.subarray(eoiIndex));
      return Buffer.concat(chunks);
    }

    // 2. PNG format padding using safe tEXt chunk
    if (fmt === 'png') {
      if (needed >= 12) {
        const dataLen = needed - 12;
        const chunkType = Buffer.from('tEXt');
        const keyword = Buffer.from('Comment\0');
        let dataPayload;
        if (dataLen >= 8) {
          dataPayload = Buffer.concat([keyword, Buffer.alloc(dataLen - 8, 0x20)]);
        } else {
          dataPayload = Buffer.alloc(dataLen, 0x20);
        }

        const crcBuffer = Buffer.concat([chunkType, dataPayload]);
        const crc = crc32(crcBuffer);

        const lenBuf = Buffer.alloc(4);
        lenBuf.writeUInt32BE(dataPayload.length, 0);

        const crcBuf = Buffer.alloc(4);
        crcBuf.writeUInt32BE(crc >>> 0, 0);

        const iendIndex = buffer.length - 12;
        return Buffer.concat([
          buffer.subarray(0, iendIndex),
          lenBuf,
          chunkType,
          dataPayload,
          crcBuf,
          buffer.subarray(iendIndex)
        ]);
      }
    }
  } catch (err) {
    console.warn('Padding warning:', err.message);
  }

  return buffer;
};

/**
 * Compresses an image buffer using a specific format and quality setting.
 *
 * @param {Buffer} buffer - Original image buffer
 * @param {string} format - Target format ('jpeg', 'png', 'webp')
 * @param {number} quality - Integer between 1 and 100
 * @param {boolean} cleanBackground - Whether to boost contrast and clean white paper background
 * @returns {Promise<{ buffer: Buffer, info: sharp.OutputInfo }>}
 */
const renderWithQuality = async (buffer, format, quality, cleanBackground = false) => {
  let image = sharp(buffer);

  if (cleanBackground) {
    // Enhance contrast and brighten white background for scanned signatures/documents
    image = image
      .normalize()
      .linear(1.15, -15);
  }

  const q = Math.max(1, Math.min(100, Math.round(quality)));

  let result;
  switch (format.toLowerCase()) {
    case 'png':
      result = await image
        .png({
          quality: q,
          compressionLevel: 9,
          palette: true,
          effort: 7
        })
        .toBuffer({ resolveWithObject: true });
      break;

    case 'webp':
      result = await image
        .webp({
          quality: q,
          effort: 4
        })
        .toBuffer({ resolveWithObject: true });
      break;

    case 'jpeg':
    case 'jpg':
    default:
      result = await image
        .jpeg({
          quality: q,
          mozjpeg: true,
          chromaSubsampling: q > 90 ? '4:4:4' : '4:2:0'
        })
        .toBuffer({ resolveWithObject: true });
      break;
  }

  return {
    buffer: result.data,
    info: result.info
  };
};

/**
 * Performs target size compression/expansion on an image using binary search quality tuning.
 *
 * @param {Buffer} inputBuffer - Original image buffer
 * @param {Object} options - Compression options
 * @param {string} options.targetMode - 'target_size' | 'target_range' | 'manual_quality'
 * @param {number} [options.targetSizeKb] - Target size in KB (e.g. 100)
 * @param {number} [options.minSizeKb] - Minimum size in KB (for range mode)
 * @param {number} [options.maxSizeKb] - Maximum size in KB (for range mode)
 * @param {number} [options.manualQuality] - Manual quality 1-100
 * @param {boolean} [options.padToTarget] - Whether to expand/pad file size if under target KB
 * @param {boolean} [options.cleanBackground] - Clean signature paper background
 * @param {string} [options.outputFormat] - 'original' | 'jpeg' | 'png' | 'webp'
 * @param {string} options.originalName - Original file name
 * @returns {Promise<Object>} Compression result with buffer, stats, and iteration logs
 */
export const compressImageService = async (inputBuffer, options = {}) => {
  const originalSize = inputBuffer.length;
  const initialMetadata = await sharp(inputBuffer).metadata();
  
  // Determine output format
  let format = (options.outputFormat || 'original').toLowerCase();
  if (format === 'original' || !format) {
    format = (initialMetadata.format || 'jpeg').toLowerCase();
    if (format === 'jpg') format = 'jpeg';
  }

  const cleanBackground = options.cleanBackground === true || options.cleanBackground === 'true';
  const padToTarget = options.padToTarget === true || options.padToTarget === 'true' || options.exactTargetSize === true;

  const iterations = [];
  let finalBuffer = null;
  let finalQuality = 80;
  let warningMessage = null;

  // Case 1: Manual Quality Mode
  if (options.targetMode === 'manual_quality' || options.targetMode === 'quality') {
    finalQuality = options.manualQuality ? parseInt(options.manualQuality, 10) : 80;
    const result = await renderWithQuality(inputBuffer, format, finalQuality, cleanBackground);
    finalBuffer = result.buffer;
    iterations.push({
      step: 1,
      quality: finalQuality,
      sizeBytes: finalBuffer.length,
      formattedSize: formatBytes(finalBuffer.length),
      status: 'Manual Quality applied'
    });
  } 
  // Case 2: Custom Range Compression (Min KB to Max KB, e.g. 10KB - 20KB or 20KB - 50KB)
  else if (options.targetMode === 'target_range') {
    const minBytes = Math.max(1, (parseFloat(options.minSizeKb) || 10) * 1024);
    const maxBytes = Math.max(minBytes, (parseFloat(options.maxSizeKb) || 20) * 1024);

    let lowQuality = 5;
    let highQuality = 100;
    let bestResult = null;
    let stepCount = 0;

    while (lowQuality <= highQuality && stepCount < 8) {
      stepCount++;
      const currentQuality = Math.round((lowQuality + highQuality) / 2);
      const result = await renderWithQuality(inputBuffer, format, currentQuality, cleanBackground);
      const currentSize = result.buffer.length;

      iterations.push({
        step: stepCount,
        quality: currentQuality,
        sizeBytes: currentSize,
        formattedSize: formatBytes(currentSize),
        status: currentSize <= maxBytes && currentSize >= minBytes ? 'Within Range ✓' : currentSize > maxBytes ? 'Above Max' : 'Below Min'
      });

      if (currentSize <= maxBytes) {
        bestResult = { buffer: result.buffer, quality: currentQuality };
        if (currentSize >= minBytes) {
          // Perfect fit in range
          break;
        }
        // Try higher quality to get closer to maxBytes
        lowQuality = currentQuality + 1;
      } else {
        // Exceeds maxBytes, lower quality
        highQuality = currentQuality - 1;
      }
    }

    if (bestResult) {
      finalBuffer = bestResult.buffer;
      finalQuality = bestResult.quality;
    } else {
      // Scale down dimensions to fit within range
      let scale = 0.8;
      let scaledBuffer = await sharp(inputBuffer).resize(Math.round(initialMetadata.width * scale)).toBuffer();
      const fallback = await renderWithQuality(scaledBuffer, format, 70, cleanBackground);
      finalBuffer = fallback.buffer;
      finalQuality = 70;
    }

    // If final buffer is smaller than minBytes, pad it into the safe middle of the range!
    if (finalBuffer.length < minBytes) {
      const targetMidBytes = Math.round((minBytes + maxBytes) / 2);
      finalBuffer = padBufferToTarget(finalBuffer, format, targetMidBytes);
      iterations.push({
        step: stepCount + 1,
        quality: finalQuality,
        sizeBytes: finalBuffer.length,
        formattedSize: formatBytes(finalBuffer.length),
        status: `Size increased to reach required ${formatBytes(minBytes)} - ${formatBytes(maxBytes)} range ✓`
      });
    }
  } 
  // Case 3: Target KB Compression / Increase (e.g. 20KB, 50KB, 100KB)
  else {
    const targetBytes = (parseFloat(options.targetSizeKb) || 100) * 1024;
    
    // Binary search for highest quality under or near target
    let lowQuality = 5;
    let highQuality = 100;
    let bestResult = null;
    let stepCount = 0;

    while (lowQuality <= highQuality && stepCount < 8) {
      stepCount++;
      const currentQuality = Math.round((lowQuality + highQuality) / 2);
      const result = await renderWithQuality(inputBuffer, format, currentQuality, cleanBackground);
      const currentSize = result.buffer.length;

      const isAcceptable = currentSize <= targetBytes;

      iterations.push({
        step: stepCount,
        quality: currentQuality,
        sizeBytes: currentSize,
        formattedSize: formatBytes(currentSize),
        status: isAcceptable ? 'Under Target ✓' : 'Over Target ✕'
      });

      if (isAcceptable) {
        bestResult = { buffer: result.buffer, quality: currentQuality };
        if (currentSize >= targetBytes * 0.94) {
          break;
        }
        lowQuality = currentQuality + 1;
      } else {
        highQuality = currentQuality - 1;
      }
    }

    if (bestResult) {
      finalBuffer = bestResult.buffer;
      finalQuality = bestResult.quality;
    } else {
      // Scale down dimensions to fit within target KB
      const fallbackScale = Math.min(0.85, Math.sqrt((targetBytes * 0.9) / Math.max(1, originalSize)));
      const scaledBuffer = await sharp(inputBuffer).resize(Math.max(50, Math.round(initialMetadata.width * fallbackScale))).toBuffer();
      const fallback = await renderWithQuality(scaledBuffer, format, 70, cleanBackground);
      finalBuffer = fallback.buffer;
      finalQuality = 70;
    }

    // If user requested target size padding OR if buffer is smaller than target and padToTarget is set:
    if (padToTarget && finalBuffer.length < targetBytes) {
      finalBuffer = padBufferToTarget(finalBuffer, format, targetBytes);
      iterations.push({
        step: stepCount + 1,
        quality: finalQuality,
        sizeBytes: finalBuffer.length,
        formattedSize: formatBytes(finalBuffer.length),
        status: `Size increased to target ${formatBytes(targetBytes)} ✓`
      });
    }
  }

  // Inspect output metadata
  const outputMetadata = await sharp(finalBuffer).metadata();
  const finalSize = finalBuffer.length;
  const savingsPercent = calculateSavingsPercentage(originalSize, finalSize);

  // Generate Base64 Data URI for immediate frontend rendering & instant download
  const mimeType = `image/${format === 'jpeg' ? 'jpeg' : format}`;
  const base64DataUri = `data:${mimeType};base64,${finalBuffer.toString('base64')}`;

  // Generate output filename
  const originalBaseName = (options.originalName || 'image').replace(/\.[^/.]+$/, '');
  const outputExtension = format === 'jpeg' ? 'jpg' : format;
  const outputFilename = `${originalBaseName}-optimized.${outputExtension}`;

  return {
    original: {
      name: options.originalName || 'image',
      sizeBytes: originalSize,
      formattedSize: formatBytes(originalSize),
      width: initialMetadata.width || 0,
      height: initialMetadata.height || 0,
      format: (initialMetadata.format || 'unknown').toUpperCase()
    },
    compressed: {
      filename: outputFilename,
      sizeBytes: finalSize,
      formattedSize: formatBytes(finalSize),
      width: outputMetadata.width || 0,
      height: outputMetadata.height || 0,
      format: format.toUpperCase(),
      mimeType,
      qualityUsed: finalQuality,
      savingsPercent,
      isEnlarged: finalSize > originalSize,
      dataUri: base64DataUri
    },
    optimization: {
      mode: options.targetMode || 'target_size',
      targetSizeKb: options.targetSizeKb,
      iterations,
      totalIterations: iterations.length,
      warning: warningMessage,
      status: warningMessage ? 'WARNING' : 'SUCCESS'
    }
  };
};
