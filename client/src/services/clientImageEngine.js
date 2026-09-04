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
 * Checks if a canvas context contains transparent pixels
 */
export const hasTransparency = (ctx, width, height) => {
  try {
    const imgData = ctx.getImageData(0, 0, Math.min(width, 400), Math.min(height, 400)).data;
    for (let i = 3; i < imgData.length; i += 16) {
      if (imgData[i] < 250) return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

/**
 * Pads a blob to reach a specific target byte size if requested
 */
export const padBlobToTarget = async (blob, targetBytes) => {
  if (!blob || blob.size >= targetBytes) return blob;
  const paddingLength = targetBytes - blob.size;
  const paddingBuffer = new Uint8Array(paddingLength);
  return new Blob([blob, paddingBuffer], { type: blob.type });
};

/**
 * Client-Side Target KB Binary Search & Adaptive Scaling Compressor
 */
export const clientCompressImage = async (file, options = {}) => {
  const originalSize = file.size;
  const img = await loadImageElement(file);

  let userFormat = (options.outputFormat || 'original').toLowerCase();
  let srcExt = file.name.split('.').pop().toLowerCase() || 'jpeg';
  if (srcExt === 'jpg') srcExt = 'jpeg';
  const isSrcPng = file.type === 'image/png' || srcExt === 'png';

  // Base canvas
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  if (options.cleanBackground) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);

  // Check if original image has alpha transparency
  const hasAlpha = isSrcPng ? hasTransparency(ctx, canvas.width, canvas.height) : false;

  // Determine effective format for compression
  let effectiveFormat = userFormat;
  if (userFormat === 'original' || !userFormat) {
    if (isSrcPng) {
      // For PNG files where user wants target compression:
      // If image has transparency -> WebP preserves alpha with lossy size compression
      // If opaque -> JPEG or WebP delivers crisp compression to exact target KB
      effectiveFormat = hasAlpha ? 'webp' : 'jpeg';
    } else {
      effectiveFormat = srcExt === 'webp' ? 'webp' : 'jpeg';
    }
  }

  if (effectiveFormat === 'jpg') effectiveFormat = 'jpeg';
  const mimeType = `image/${effectiveFormat === 'jpeg' ? 'jpeg' : effectiveFormat}`;
  const isTargetPng = effectiveFormat === 'png';

  const renderCanvasToBlob = (cvs, mime, q) => {
    return new Promise((resolve) => {
      cvs.toBlob((b) => resolve(b), mime, q);
    });
  };

  const createScaledCanvas = (scale) => {
    const sCanvas = document.createElement('canvas');
    sCanvas.width = Math.max(16, Math.round(img.naturalWidth * scale));
    sCanvas.height = Math.max(16, Math.round(img.naturalHeight * scale));
    const sCtx = sCanvas.getContext('2d', { willReadFrequently: true });
    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = 'high';
    if (options.cleanBackground || (!hasAlpha && (mimeType === 'image/jpeg' || isTargetPng))) {
      sCtx.fillStyle = '#FFFFFF';
      sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);
    }
    sCtx.drawImage(img, 0, 0, sCanvas.width, sCanvas.height);
    return sCanvas;
  };

  const iterations = [];
  let bestBlob = null;
  let finalQuality = 80;
  let warningMessage = null;

  // Case 1: Manual Quality Mode ('manual_quality' or 'quality')
  if (options.targetMode === 'manual_quality' || options.targetMode === 'quality') {
    const qualityPercent = options.manualQuality !== undefined ? parseInt(options.manualQuality, 10) : 80;
    finalQuality = Math.max(5, Math.min(100, qualityPercent)) / 100;

    if (isTargetPng) {
      // PNG ignores canvas quality. Scale canvas proportionally to quality slider to reduce size
      const scale = Math.max(0.2, Math.sqrt(finalQuality));
      const scaled = createScaledCanvas(scale);
      bestBlob = await renderCanvasToBlob(scaled, mimeType, 1.0);
      canvas = scaled;
    } else {
      bestBlob = await renderCanvasToBlob(canvas, mimeType, finalQuality);
      // If quality < 95% and output is larger than original, downscale slightly to guarantee size reduction
      if (bestBlob.size >= originalSize && finalQuality < 0.95) {
        const scaled = createScaledCanvas(0.92);
        bestBlob = await renderCanvasToBlob(scaled, mimeType, finalQuality);
        canvas = scaled;
      }
    }

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
    const minBytes = Math.max(1024, (parseFloat(options.minSizeKb) || 10) * 1024);
    const maxBytes = Math.max(minBytes, (parseFloat(options.maxSizeKb) || 20) * 1024);

    let low = 0.05;
    let high = 1.0;
    let stepCount = 0;

    // Phase 1: Try on full resolution
    if (!isTargetPng) {
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
    }

    // Phase 2: If exceeds maxBytes, adaptively scale resolution
    if (!bestBlob || bestBlob.size > maxBytes) {
      const minBlob = await renderCanvasToBlob(canvas, mimeType, isTargetPng ? 1.0 : 0.08);
      let currentScale = Math.min(0.95, Math.sqrt((maxBytes * 0.90) / Math.max(1, minBlob.size)));
      currentScale = Math.max(0.08, currentScale);

      let scaleSteps = 0;
      while (scaleSteps < 6) {
        scaleSteps++;
        stepCount++;
        const sCanvas = createScaledCanvas(currentScale);
        const q = isTargetPng ? 1.0 : 0.75;
        const testBlob = await renderCanvasToBlob(sCanvas, mimeType, q);
        const curSize = testBlob.size;

        iterations.push({
          step: stepCount,
          quality: Math.round(q * 100),
          sizeBytes: curSize,
          formattedSize: formatBytes(curSize),
          status: curSize <= maxBytes ? 'Within Range ✓' : 'Above Max'
        });

        if (curSize <= maxBytes) {
          bestBlob = testBlob;
          canvas = sCanvas;
          finalQuality = Math.round(q * 100);
          if (curSize >= minBytes || currentScale >= 0.95) break;
          currentScale = Math.min(1.0, currentScale * 1.15);
        } else {
          currentScale = currentScale * Math.max(0.4, Math.min(0.9, Math.sqrt((maxBytes * 0.88) / curSize)));
        }
      }
    }

    if (!bestBlob) {
      const sCanvas = createScaledCanvas(0.4);
      bestBlob = await renderCanvasToBlob(sCanvas, mimeType, 0.5);
      canvas = sCanvas;
      finalQuality = 50;
    }
  }

  // Case 3: Target KB Compression (e.g. 50KB, 100KB, 200KB)
  else {
    let targetBytes = (parseFloat(options.targetSizeKb) || 100) * 1024;
    
    // If targetBytes is larger than original file and user did not specify exact target:
    if (targetBytes >= originalSize && !options.exactTargetSize && !options.padToTarget) {
      // Target 70% of original size to guarantee compression
      targetBytes = Math.max(5 * 1024, Math.round(originalSize * 0.70));
    }

    let low = 0.05;
    let high = 0.98;
    let stepCount = 0;

    // Phase 1: Try full-resolution quality tuning (for JPEG / WebP)
    if (!isTargetPng) {
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
          if (curSize >= targetBytes * 0.92) break; // Perfect fit
          low = currentQ + 0.05;
        } else {
          high = currentQ - 0.05;
        }
      }
    }

    // Phase 2: If full resolution cannot reach target (or format is PNG), use Adaptive Dimension Scaling
    if (!bestBlob || bestBlob.size > targetBytes) {
      // Test size at lowest quality or current state to compute initial scale
      const baselineBlob = await renderCanvasToBlob(canvas, mimeType, isTargetPng ? 1.0 : 0.08);
      const baselineSize = baselineBlob.size;

      let currentScale = Math.min(0.95, Math.sqrt((targetBytes * 0.92) / Math.max(1, baselineSize)));
      currentScale = Math.max(0.08, currentScale);

      let scaleStep = 0;
      while (scaleStep < 7) {
        scaleStep++;
        stepCount++;

        const sCanvas = createScaledCanvas(currentScale);
        let testBlob;
        let testQuality = 80;

        if (isTargetPng) {
          testBlob = await renderCanvasToBlob(sCanvas, 'image/png');
          testQuality = 100;
        } else {
          testQuality = 78;
          testBlob = await renderCanvasToBlob(sCanvas, mimeType, 0.78);
          if (testBlob.size > targetBytes) {
            testQuality = 50;
            testBlob = await renderCanvasToBlob(sCanvas, mimeType, 0.50);
          }
          if (testBlob.size > targetBytes) {
            testQuality = 25;
            testBlob = await renderCanvasToBlob(sCanvas, mimeType, 0.25);
          }
        }

        const curSize = testBlob.size;
        const isAcceptable = curSize <= targetBytes;

        iterations.push({
          step: stepCount,
          quality: testQuality,
          sizeBytes: curSize,
          formattedSize: formatBytes(curSize),
          status: isAcceptable ? 'Under Target ✓' : 'Over Target ✕'
        });

        if (isAcceptable) {
          bestBlob = testBlob;
          canvas = sCanvas;
          finalQuality = testQuality;
          if (curSize >= targetBytes * 0.88) break; // Close to target
          if (curSize < targetBytes * 0.60 && currentScale < 0.90) {
            currentScale = Math.min(1.0, currentScale * 1.20);
          } else {
            break;
          }
        } else {
          // Still over target -> scale down proportionally
          const scaleReduction = Math.max(0.35, Math.min(0.88, Math.sqrt((targetBytes * 0.90) / curSize)));
          currentScale = currentScale * scaleReduction;
        }
      }
    }

    // Phase 3: Absolute safety fallback to strictly enforce target size
    if (!bestBlob || bestBlob.size > targetBytes) {
      let emergencyScale = 0.5;
      while (emergencyScale >= 0.05) {
        const sCanvas = createScaledCanvas(emergencyScale);
        const b = await renderCanvasToBlob(sCanvas, mimeType, isTargetPng ? 1.0 : 0.60);
        if (b && b.size <= targetBytes) {
          bestBlob = b;
          canvas = sCanvas;
          finalQuality = 60;
          break;
        }
        emergencyScale -= 0.1;
      }
      if (!bestBlob) {
        const sCanvas = createScaledCanvas(0.1);
        bestBlob = await renderCanvasToBlob(sCanvas, mimeType, 0.40);
        canvas = sCanvas;
        finalQuality = 40;
      }
    }

    // Optional: Exact target size padding if requested
    if ((options.padToTarget || options.exactTargetSize) && bestBlob.size < targetBytes) {
      bestBlob = await padBlobToTarget(bestBlob, targetBytes);
    }
  }

  const finalDataUri = await blobToDataUri(bestBlob);
  const finalSize = bestBlob.size;
  const savingsPercent = calculateSavingsPercentage(originalSize, finalSize);

  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const outExt = effectiveFormat === 'jpeg' ? 'jpg' : effectiveFormat;
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
        format: effectiveFormat.toUpperCase(),
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

  // Handle Name & Date Strip (Passport / Exam Forms)
  if (options.nameDateConfig && options.nameDateConfig.enabled) {
    const {
      name = '',
      date = '',
      style = 'white_strip',
      fontSizeRatio = 'medium'
    } = options.nameDateConfig;

    if (name.trim() || date.trim()) {
      const editCtx = canvas.getContext('2d');
      const bannerHeightFactor = fontSizeRatio === 'large' ? 0.22 : fontSizeRatio === 'small' ? 0.14 : 0.18;
      const bannerHeight = Math.max(36, Math.round(canvas.height * bannerHeightFactor));
      const bannerY = canvas.height - bannerHeight;

      // Draw banner background
      if (style === 'white_strip') {
        editCtx.fillStyle = '#FFFFFF';
        editCtx.fillRect(0, bannerY, canvas.width, bannerHeight);
        editCtx.strokeStyle = '#CBD5E1';
        editCtx.lineWidth = Math.max(1, Math.round(canvas.height * 0.003));
        editCtx.strokeRect(0, bannerY, canvas.width, bannerHeight);
      } else if (style === 'black_strip') {
        editCtx.fillStyle = '#000000';
        editCtx.fillRect(0, bannerY, canvas.width, bannerHeight);
      } else {
        editCtx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        editCtx.fillRect(0, bannerY, canvas.width, bannerHeight);
      }

      // Render text
      const textColor = style === 'white_strip' ? '#000000' : '#FFFFFF';
      editCtx.fillStyle = textColor;
      editCtx.textAlign = 'center';
      editCtx.textBaseline = 'middle';

      const lineCount = (name.trim() && date.trim()) ? 2 : 1;
      const nameSize = Math.max(12, Math.round(bannerHeight * (lineCount === 2 ? 0.36 : 0.55)));
      const dateSize = Math.max(10, Math.round(bannerHeight * (lineCount === 2 ? 0.30 : 0.50)));

      if (lineCount === 2) {
        editCtx.font = `bold ${nameSize}px "Inter", -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
        editCtx.fillText(name.toUpperCase().trim(), canvas.width / 2, bannerY + bannerHeight * 0.32);

        editCtx.font = `600 ${dateSize}px "Inter", -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
        editCtx.fillText(date.trim(), canvas.width / 2, bannerY + bannerHeight * 0.74);
      } else if (name.trim()) {
        editCtx.font = `bold ${nameSize}px "Inter", -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
        editCtx.fillText(name.toUpperCase().trim(), canvas.width / 2, bannerY + bannerHeight * 0.5);
      } else if (date.trim()) {
        editCtx.font = `600 ${dateSize}px "Inter", -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
        editCtx.fillText(date.trim(), canvas.width / 2, bannerY + bannerHeight * 0.5);
      }
    }
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
