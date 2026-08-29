import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const archiver = require('archiver');
import { compressImageService } from './compressionService.js';
import { resizeImageService } from './resizeService.js';
import { convertImageService } from './conversionService.js';
import { formatBytes, calculateSavingsPercentage } from '../utils/fileUtils.js';

/**
 * Creates an in-memory ZIP archive buffer containing all processed images.
 *
 * @param {Array<{ filename: string, buffer: Buffer }>} processedFiles 
 * @returns {Promise<Buffer>}
 */
const createZipBuffer = (processedFiles) => {
  return new Promise((resolve, reject) => {
    const archive = new archiver.ZipArchive({
      zlib: { level: 6 }
    });

    const buffers = [];
    archive.on('data', (data) => buffers.push(data));
    archive.on('end', () => resolve(Buffer.concat(buffers)));
    archive.on('error', (err) => reject(err));

    for (const item of processedFiles) {
      archive.append(item.buffer, { name: item.filename });
    }

    archive.finalize();
  });
};

/**
 * Processes a batch of uploaded images concurrently and packages them into a ZIP archive.
 *
 * @param {Array<Express.Multer.File>} files - Uploaded files array
 * @param {Object} options - Batch processing options
 * @returns {Promise<Object>} Batch result with individual files and ZIP Data URI
 */
export const processBatchService = async (files = [], options = {}) => {
  if (!files || files.length === 0) {
    throw new Error('No files were provided for batch processing.');
  }

  const processedResults = [];
  const filesForZip = [];

  let totalOriginalBytes = 0;
  let totalProcessedBytes = 0;

  for (const file of files) {
    totalOriginalBytes += file.size;

    try {
      let result;
      const action = options.action || 'compress';

      if (action === 'resize') {
        result = await resizeImageService(file.buffer, {
          resizeMode: options.resizeMode || 'percentage',
          percentage: options.percentage || 50,
          targetWidth: options.targetWidth,
          targetHeight: options.targetHeight,
          maintainAspectRatio: options.maintainAspectRatio !== false,
          quality: options.quality || 85,
          outputFormat: options.outputFormat || 'original',
          originalName: file.originalname
        });
      } else if (action === 'convert') {
        result = await convertImageService(file.buffer, {
          targetFormat: options.outputFormat || 'webp',
          quality: options.quality || 85,
          originalName: file.originalname
        });
      } else {
        // Default: Target KB compression
        result = await compressImageService(file.buffer, {
          targetMode: options.targetMode || 'target_size',
          targetSizeKb: options.targetSizeKb || 100,
          minSizeKb: options.minSizeKb,
          maxSizeKb: options.maxSizeKb,
          manualQuality: options.manualQuality || 80,
          outputFormat: options.outputFormat || 'original',
          originalName: file.originalname
        });
      }

      const processedObj = result.compressed || result.resized || result.converted;
      const base64Data = processedObj.dataUri.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');

      filesForZip.push({
        filename: processedObj.filename,
        buffer
      });

      totalProcessedBytes += processedObj.sizeBytes;

      processedResults.push({
        originalName: file.originalname,
        filename: processedObj.filename,
        originalSizeBytes: file.size,
        originalFormattedSize: formatBytes(file.size),
        finalSizeBytes: processedObj.sizeBytes,
        finalFormattedSize: processedObj.formattedSize,
        savingsPercent: processedObj.savingsPercent,
        format: processedObj.format,
        width: processedObj.width,
        height: processedObj.height,
        status: 'SUCCESS'
      });
    } catch (err) {
      processedResults.push({
        originalName: file.originalname,
        filename: file.originalname,
        originalSizeBytes: file.size,
        originalFormattedSize: formatBytes(file.size),
        finalSizeBytes: file.size,
        finalFormattedSize: formatBytes(file.size),
        savingsPercent: 0,
        status: 'FAILED',
        error: err.message
      });
    }
  }

  // Create ZIP archive
  const zipBuffer = await createZipBuffer(filesForZip);
  const zipDataUri = `data:application/zip;base64,${zipBuffer.toString('base64')}`;
  const zipFilename = `imageinkb-batch-${Date.now()}.zip`;
  const totalSavingsPercent = calculateSavingsPercentage(totalOriginalBytes, totalProcessedBytes);

  return {
    totalFiles: files.length,
    successfulFiles: filesForZip.length,
    failedFiles: files.length - filesForZip.length,
    totalOriginalBytes,
    totalOriginalFormattedSize: formatBytes(totalOriginalBytes),
    totalProcessedBytes,
    totalProcessedFormattedSize: formatBytes(totalProcessedBytes),
    totalSavingsPercent,
    zipFilename,
    zipSizeBytes: zipBuffer.length,
    zipFormattedSize: formatBytes(zipBuffer.length),
    zipDataUri,
    files: processedResults
  };
};
