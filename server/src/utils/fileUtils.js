/**
 * Formats bytes into a human-readable string (Bytes, KB, MB, GB).
 * Uses binary base (1024) with standard conventions.
 *
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string} Formatted size (e.g. "1.45 MB", "512 KB")
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Calculates percentage size difference between original and new size.
 *
 * @param {number} originalBytes
 * @param {number} newBytes
 * @returns {number} Percentage reduced (e.g., 65.4)
 */
export const calculateSavingsPercentage = (originalBytes, newBytes) => {
  if (!originalBytes || originalBytes === 0) return 0;
  const savings = ((originalBytes - newBytes) / originalBytes) * 100;
  return Number(Math.max(0, savings).toFixed(2));
};

/**
 * Generates a sanitized and safe filename.
 *
 * @param {string} originalName
 * @returns {string} Sanitized string
 */
export const sanitizeFilename = (originalName) => {
  return originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
};
