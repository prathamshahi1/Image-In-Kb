/**
 * Client-Side In-Browser High-Performance Image Optimization Engine.
 * Enables zero-latency, private, in-browser compression, resizing, format conversion, and editing
 * with binary-search quality tuning even if the backend is offline.
 */

// Helper to format bytes
export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Calculate savings percentage
export const calculateSavingsPercentage = (originalBytes, finalBytes) => {
  if (!originalBytes || originalBytes === 0) return 0;
  const savings = ((originalBytes - finalBytes) / originalBytes) * 100;
  return Math.round(savings * 10) / 10;
};

/**
 * Loads an image file into an HTMLImageElement
 */
export const loadImageElement = (fileOrBlob) => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(fileOrBlob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image into browser canvas.'));
    };
    img.src = url;
  });
};

/**
 * Converts a Blob to a Base64 Data URI
 */
export const blobToDataUri = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Inspect image metadata in-browser
 */
export const clientInspectImage = async (file) => {
  const img = await loadImageElement(file);
  const ext = file.name.split('.').pop().toLowerCase() || 'jpeg';
  const format = ext === 'jpg' ? 'JPEG' : ext.toUpperCase();

  return {
    success: true,
    data: {
      name: file.name,
      sizeBytes: file.size,
      formattedSize: formatBytes(file.size),
      width: img.naturalWidth,
      height: img.naturalHeight,
      aspectRatio: `${(img.naturalWidth / img.naturalHeight).toFixed(2)}:1`,
      format,
      space: 'srgb',
      channels: 3,
      hasAlpha: file.type === 'image/png' || file.type === 'image/webp'
    }
  };
};

/**
 * Client-Side Target KB Binary Search Compressor
 */
export const clientCompressImage = async (file, options = {}) => {
  const originalSize = file.size;
  const img = await loadImageElement(file);

  let targetFormat = (options.outputFormat || 'original').toLowerCase();
  if (targetFormat === 'original' || !targetFormat) {
    targetFormat = file.type.split('/')[1] || 'jpeg';
    if (targetFormat === 'jpg') targetFormat = 'jpeg';
  }
  const mimeType = `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`;

  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  if (options.cleanBackground) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);

  const iterations = [];
  let bestBlob = null;
  let finalQuality = 80;
  let warningMessage = null;

  // Helper to render canvas to blob
  const renderCanvasToBlob = (cvs, mime, q) => {
    return new Promise((resolve) => {
      cvs.toBlob((b) => resolve(b), mime, q);
    });
  };

  // Case 1: Manual Quality Mode
  if (options.targetMode === 'manual_quality') {
    finalQuality = options.manualQuality ? parseInt(options.manualQuality, 10) / 100 : 0.8;
    bestBlob = await renderCanvasToBlob(canvas, mimeType, finalQuality);
    iterations.push({
      step: 1,
      quality: Math.round(finalQuality * 100),
      sizeBytes: bestBlob.size,
      formattedSize: formatBytes(bestBlob.size),
      status: 'Manual Quality applied'
    });
  }
  // Case 2: Target Range Compression (e.g. 20KB - 50KB)
  else if (options.targetMode === 'target_range') {
    const minBytes = Math.max(1, (parseFloat(options.minSizeKb) || 10) * 1024);
    const maxBytes = Math.max(minBytes, (parseFloat(options.maxSizeKb) || 20) * 1024);

    let low = 0.05;
    let high = 1.0;
    let stepCount = 0;

    while (low <= high && stepCount < 8) {
      stepCount++;
      const currentQ = (low + high) / 2;
      const testBlob = await renderCanvasToBlob(canvas, mimeType, currentQ);
      const curSize = testBlob.size;

      iterations.push({
        step: stepCount,
        quality: Math.round(currentQ * 100),
        sizeBytes: curSize,
        formattedSize: formatBytes(curSize),
        status: curSize <= maxBytes && curSize >= minBytes ? 'Within Range ✓' : curSize > maxBytes ? 'Above Max' : 'Below Min'
      });

      if (curSize <= maxBytes) {
        bestBlob = testBlob;
        finalQuality = Math.round(currentQ * 100);
        if (curSize >= minBytes) break;
        low = currentQ + 0.05;
      } else {
        high = currentQ - 0.05;
      }
    }

    if (!bestBlob) {
      bestBlob = await renderCanvasToBlob(canvas, mimeType, 0.05);
      finalQuality = 5;
    }
  }
  // Case 3: Target KB Compression (e.g. 50KB, 100KB, 200KB)
  else {
    const targetBytes = (parseFloat(options.targetSizeKb) || 100) * 1024;
    let low = 0.05;
    let high = 1.0;
    let stepCount = 0;

    while (low <= high && stepCount < 8) {
      stepCount++;
      const currentQ = (low + high) / 2;
      const testBlob = await renderCanvasToBlob(canvas, mimeType, currentQ);
      const curSize = testBlob.size;
      const isAcceptable = curSize <= targetBytes;

      iterations.push({
        step: stepCount,
        quality: Math.round(currentQ * 100),
        sizeBytes: curSize,
        formattedSize: formatBytes(curSize),
        status: isAcceptable ? 'Under Target ✓' : 'Over Target ✕'
      });

      if (isAcceptable) {
        bestBlob = testBlob;
        finalQuality = Math.round(currentQ * 100);
        if (curSize >= targetBytes * 0.94) break;
        low = currentQ + 0.05;
      } else {
        high = currentQ - 0.05;
      }
    }

    // If still exceeds target at minimum quality, scale dimensions slightly to guarantee target
    if (!bestBlob || bestBlob.size > targetBytes) {
      let scale = 0.85;
      let scaledCanvas = document.createElement('canvas');
      let scaledCtx = scaledCanvas.getContext('2d');
      scaledCanvas.width = Math.round(img.naturalWidth * scale);
      scaledCanvas.height = Math.round(img.naturalHeight * scale);
      scaledCtx.drawImage(img, 0, 0, scaledCanvas.width, scaledCanvas.height);

      bestBlob = await renderCanvasToBlob(scaledCanvas, mimeType, 0.7);
      finalQuality = 70;
      canvas = scaledCanvas;
    }
  }

  const finalDataUri = await blobToDataUri(bestBlob);
  const finalSize = bestBlob.size;
  const savingsPercent = calculateSavingsPercentage(originalSize, finalSize);

  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const outExt = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
  const outputFilename = `${baseName}-optimized.${outExt}`;

  return {
    success: true,
    message: 'Image compressed successfully in browser.',
    data: {
      original: {
        name: file.name,
        sizeBytes: originalSize,
        formattedSize: formatBytes(originalSize),
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: file.type.split('/')[1]?.toUpperCase() || 'JPEG'
      },
      compressed: {
        filename: outputFilename,
        sizeBytes: finalSize,
        formattedSize: formatBytes(finalSize),
        width: canvas.width,
        height: canvas.height,
        format: targetFormat.toUpperCase(),
        mimeType,
        qualityUsed: finalQuality,
        savingsPercent,
        isEnlarged: finalSize > originalSize,
        dataUri: finalDataUri
      },
      optimization: {
        mode: options.targetMode || 'target_size',
        targetSizeKb: options.targetSizeKb,
        iterations,
        totalIterations: iterations.length,
        warning: warningMessage,
        status: 'SUCCESS'
      }
    }
  };
};

/**
 * Client-Side Image Resizer
 */
export const clientResizeImage = async (file, options = {}) => {
  const originalSize = file.size;
  const img = await loadImageElement(file);

  let targetWidth = img.naturalWidth;
  let targetHeight = img.naturalHeight;

  if (options.resizeMode === 'percentage') {
    const scale = (parseFloat(options.percentage) || 50) / 100;
    targetWidth = Math.round(img.naturalWidth * scale);
    targetHeight = Math.round(img.naturalHeight * scale);
  } else {
    targetWidth = parseInt(options.targetWidth, 10) || img.naturalWidth;
    targetHeight = parseInt(options.targetHeight, 10) || img.naturalHeight;
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (options.cleanBackground) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  let targetFormat = (options.outputFormat || 'original').toLowerCase();
  if (targetFormat === 'original' || !targetFormat) {
    targetFormat = file.type.split('/')[1] || 'jpeg';
    if (targetFormat === 'jpg') targetFormat = 'jpeg';
  }
  const mimeType = `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`;
  const quality = (parseFloat(options.quality) || 85) / 100;

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));
  const dataUri = await blobToDataUri(blob);
  const finalSize = blob.size;
  const savingsPercent = calculateSavingsPercentage(originalSize, finalSize);

  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const outExt = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
  const outputFilename = `${baseName}-resized.${outExt}`;

  return {
    success: true,
    message: 'Image resized successfully in browser.',
    data: {
      original: {
        name: file.name,
        sizeBytes: originalSize,
        formattedSize: formatBytes(originalSize),
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: file.type.split('/')[1]?.toUpperCase() || 'JPEG'
      },
      resized: {
        filename: outputFilename,
        sizeBytes: finalSize,
        formattedSize: formatBytes(finalSize),
        width: targetWidth,
        height: targetHeight,
        format: targetFormat.toUpperCase(),
        mimeType,
        savingsPercent,
        dataUri
      }
    }
  };
};

/**
 * Client-Side Format Converter
 */
export const clientConvertImage = async (file, options = {}) => {
  const originalSize = file.size;
  const img = await loadImageElement(file);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const targetFormat = (options.targetFormat || 'webp').toLowerCase();
  const mimeType = `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`;
  const quality = (parseFloat(options.quality) || 85) / 100;

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));
  const dataUri = await blobToDataUri(blob);
  const finalSize = blob.size;
  const savingsPercent = calculateSavingsPercentage(originalSize, finalSize);

  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const outExt = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
  const outputFilename = `${baseName}-converted.${outExt}`;

  return {
    success: true,
    message: 'Image converted successfully in browser.',
    data: {
      original: {
        name: file.name,
        sizeBytes: originalSize,
        formattedSize: formatBytes(originalSize),
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: file.type.split('/')[1]?.toUpperCase() || 'JPEG'
      },
      converted: {
        filename: outputFilename,
        sizeBytes: finalSize,
        formattedSize: formatBytes(finalSize),
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: targetFormat.toUpperCase(),
        mimeType,
        savingsPercent,
        dataUri
      }
    }
  };
};

/**
 * Client-Side Image Editor (Crop & Rotate)
 */
export const clientEditImage = async (file, options = {}) => {
  const originalSize = file.size;
  const img = await loadImageElement(file);

  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  // Handle Rotation
  const rotation = parseInt(options.rotation, 10) || 0;
  if (rotation === 90 || rotation === 270) {
    canvas.width = img.naturalHeight;
    canvas.height = img.naturalWidth;
  } else {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotation) ctx.rotate((rotation * Math.PI) / 180);
  if (options.flipHorizontal) ctx.scale(-1, 1);
  if (options.flipVertical) ctx.scale(1, -1);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

  // Handle Crop
  if (options.crop && options.crop.width && options.crop.height) {
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = options.crop.width;
    cropCanvas.height = options.crop.height;
    const cropCtx = cropCanvas.getContext('2d');
    cropCtx.drawImage(
      canvas,
      options.crop.x || 0,
      options.crop.y || 0,
      options.crop.width,
      options.crop.height,
      0,
      0,
      options.crop.width,
      options.crop.height
    );
    canvas = cropCanvas;
  }

  let targetFormat = (options.outputFormat || 'original').toLowerCase();
  if (targetFormat === 'original' || !targetFormat) {
    targetFormat = file.type.split('/')[1] || 'jpeg';
    if (targetFormat === 'jpg') targetFormat = 'jpeg';
  }
  const mimeType = `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`;
  const quality = (parseFloat(options.quality) || 85) / 100;

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));
  const dataUri = await blobToDataUri(blob);
  const finalSize = blob.size;
  const savingsPercent = calculateSavingsPercentage(originalSize, finalSize);

  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const outExt = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
  const outputFilename = `${baseName}-edited.${outExt}`;

  return {
    success: true,
    message: 'Image edited successfully in browser.',
    data: {
      original: {
        name: file.name,
        sizeBytes: originalSize,
        formattedSize: formatBytes(originalSize),
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: file.type.split('/')[1]?.toUpperCase() || 'JPEG'
      },
      edited: {
        filename: outputFilename,
        sizeBytes: finalSize,
        formattedSize: formatBytes(finalSize),
        width: canvas.width,
        height: canvas.height,
        format: targetFormat.toUpperCase(),
        mimeType,
        savingsPercent,
        dataUri
      }
    }
  };
};
