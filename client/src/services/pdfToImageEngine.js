import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { formatBytes } from '../utils/formatters';

// Configure Mozilla PDF.js worker
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

/**
 * Reads a File / Blob as an ArrayBuffer
 */
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Converts a Canvas to a Blob
 */
const canvasToBlob = (canvas, mimeType, quality) => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
};

/**
 * Converts a Blob to a Data URI
 */
const blobToDataUri = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Inspects a PDF file and loads page count and basic metadata
 */
export const inspectPdfDocument = async (file) => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;

    // Fetch first page to get aspect ratio and dimension estimates
    const firstPage = await pdfDoc.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1.0 });

    const pageCount = pdfDoc.numPages;
    const pagesInfo = [];

    for (let i = 1; i <= Math.min(pageCount, 100); i++) {
      pagesInfo.push({
        pageNumber: i,
        selected: true
      });
    }

    return {
      success: true,
      data: {
        name: file.name,
        sizeBytes: file.size,
        formattedSize: formatBytes(file.size),
        totalPages: pageCount,
        width: Math.round(viewport.width),
        height: Math.round(viewport.height),
        pages: pagesInfo
      }
    };
  } catch (error) {
    console.error('PDF inspect error:', error);
    throw new Error(error.message || 'Failed to inspect PDF document. Please ensure it is a valid, uncorrupted PDF.');
  }
};

/**
 * Generates low-resolution thumbnail previews for PDF pages
 */
export const generatePdfThumbnails = async (file, maxPages = 20) => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const totalPages = Math.min(pdfDoc.numPages, maxPages);
    const thumbnails = [];

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 0.35 });

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const ctx = canvas.getContext('2d');

      // Draw white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: ctx,
        viewport
      }).promise;

      const dataUri = canvas.toDataURL('image/jpeg', 0.6);
      thumbnails.push({
        pageNumber: i,
        thumbnailUrl: dataUri,
        width: Math.round(viewport.width),
        height: Math.round(viewport.height)
      });
    }

    return thumbnails;
  } catch (err) {
    console.warn('Thumbnail generation note:', err);
    return [];
  }
};

/**
 * Converts a PDF file into individual image pages and packages a ZIP archive
 * 
 * @param {File} file - The uploaded PDF file
 * @param {Object} options - Conversion options
 * @param {string} [options.format='jpeg'] - 'jpeg' | 'png' | 'webp'
 * @param {number} [options.dpiScale=2.0] - Render scale (1.5 = Standard, 2.0 = High HD, 3.0 = Ultra HD)
 * @param {number} [options.quality=90] - JPEG/WebP quality percentage (1-100)
 * @param {Array<number>} [options.selectedPages] - Specific page numbers to convert (default: all)
 * @param {Function} [onProgress] - Callback function for conversion progress (0-100)
 */
export const convertPdfToImages = async (file, options = {}, onProgress) => {
  try {
    const format = (options.format || 'jpeg').toLowerCase();
    const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;
    const ext = format === 'jpeg' ? 'jpg' : format;
    const dpiScale = parseFloat(options.dpiScale) || 2.0;
    const quality = (parseFloat(options.quality) || 90) / 100;

    const arrayBuffer = await readFileAsArrayBuffer(file);
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const totalPages = pdfDoc.numPages;

    // Determine target page numbers
    let targetPages = [];
    if (options.selectedPages && Array.isArray(options.selectedPages) && options.selectedPages.length > 0) {
      targetPages = options.selectedPages.filter((p) => p >= 1 && p <= totalPages);
    } else {
      for (let i = 1; i <= totalPages; i++) {
        targetPages.push(i);
      }
    }

    if (targetPages.length === 0) {
      throw new Error('No valid pages selected for conversion.');
    }

    const zip = new JSZip();
    const extractedImages = [];
    let totalExtractedBytes = 0;
    const baseName = file.name.replace(/\.[^/.]+$/, '');

    for (let index = 0; index < targetPages.length; index++) {
      const pageNum = targetPages[index];
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: dpiScale });

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      // Always draw white canvas background for transparency-free rendering
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: ctx,
        viewport
      }).promise;

      const blob = await canvasToBlob(canvas, mimeType, quality);
      const dataUri = await blobToDataUri(blob);
      const blobUrl = URL.createObjectURL(blob);
      const pageFormatted = String(pageNum).padStart(2, '0');
      const filename = `${baseName}-page-${pageFormatted}.${ext}`;

      totalExtractedBytes += blob.size;

      // Add to ZIP Archive
      const base64Data = dataUri.split(',')[1];
      zip.file(filename, base64Data, { base64: true });

      extractedImages.push({
        pageNumber: pageNum,
        filename,
        blob,
        blobUrl,
        dataUri,
        sizeBytes: blob.size,
        formattedSize: formatBytes(blob.size),
        width: canvas.width,
        height: canvas.height,
        aspectRatio: `${(canvas.width / canvas.height).toFixed(2)}:1`,
        format: format.toUpperCase()
      });

      if (onProgress) {
        onProgress(Math.round(((index + 1) / targetPages.length) * 100));
      }
    }

    // Generate in-memory ZIP package
    const zipBase64 = await zip.generateAsync({ type: 'base64' });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(zipBlob);
    const zipFilename = `${baseName}-images-zipimg.zip`;

    return {
      success: true,
      message: `Successfully extracted ${extractedImages.length} page(s) from PDF.`,
      data: {
        originalPdf: {
          name: file.name,
          sizeBytes: file.size,
          formattedSize: formatBytes(file.size),
          totalPages
        },
        format: format.toUpperCase(),
        dpiScale,
        extractedPagesCount: extractedImages.length,
        totalImagesSizeBytes: totalExtractedBytes,
        formattedTotalSize: formatBytes(totalExtractedBytes),
        images: extractedImages,
        zipBlob,
        zipUrl,
        zipBase64,
        zipFilename
      }
    };
  } catch (error) {
    console.error('PDF to Image conversion error:', error);
    throw new Error(error.message || 'Failed to convert PDF to images.');
  }
};
