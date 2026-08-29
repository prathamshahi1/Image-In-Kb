/**
 * Formats a raw byte count into a readable string (e.g., "1.24 MB", "340 KB").
 *
 * @param {number} bytes 
 * @param {number} decimals 
 * @returns {string}
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Calculates percentage size difference.
 *
 * @param {number} originalBytes 
 * @param {number} newBytes 
 * @returns {number}
 */
export const calculateSavings = (originalBytes, newBytes) => {
  if (!originalBytes || originalBytes === 0) return 0;
  const savings = ((originalBytes - newBytes) / originalBytes) * 100;
  return Number(Math.max(0, savings).toFixed(2));
};

/**
 * Calculates aspect ratio representation (e.g., "16:9", "4:3", "1:1").
 *
 * @param {number} width 
 * @param {number} height 
 * @returns {string}
 */
export const getAspectRatioString = (width, height) => {
  if (!width || !height) return 'N/A';
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const ratioW = width / divisor;
  const ratioH = height / divisor;
  
  if (ratioW > 50 || ratioH > 50) {
    return `${(width / height).toFixed(2)} : 1`;
  }
  return `${ratioW}:${ratioH}`;
};

/**
 * Calculates multiple image size unit representations.
 *
 * @param {number} bytes 
 * @returns {Object}
 */
export const calculateImageSizeUnits = (bytes) => {
  const b = bytes || 0;
  return {
    bytes: b,
    kb: (b / 1024).toFixed(2),
    mb: (b / (1024 * 1024)).toFixed(4),
    gb: (b / (1024 * 1024 * 1024)).toFixed(6)
  };
};

