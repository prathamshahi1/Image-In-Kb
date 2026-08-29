import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
});

// Auto-inject token from localStorage on fresh page loads
const storedToken = localStorage.getItem('imageinkb_token') || localStorage.getItem('imageforge_token');
if (storedToken) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

/**
 * Checks server health status.
 */
export const checkServerHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return { isOnline: true, data: response.data };
  } catch (error) {
    return { isOnline: false, error: error.message };
  }
};

/* =========================================================================
   AUTH API
   ========================================================================= */

export const registerApi = async (name, email, password) => {
  const response = await apiClient.post('/api/auth/register', { name, email, password });
  return response.data;
};

export const loginApi = async (email, password) => {
  const response = await apiClient.post('/api/auth/login', { email, password });
  return response.data;
};

export const getMeApi = async () => {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};

/* =========================================================================
   HISTORY & ANALYTICS API
   ========================================================================= */

export const getHistoryApi = async () => {
  const response = await apiClient.get('/api/history');
  return response.data;
};

export const getStatsApi = async () => {
  const response = await apiClient.get('/api/history/stats');
  return response.data;
};

export const deleteHistoryApi = async (id) => {
  const response = await apiClient.delete(`/api/history/${id}`);
  return response.data;
};

/* =========================================================================
   IMAGE OPTIMIZATION API
   ========================================================================= */

export const inspectImageApi = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post('/api/images/inspect', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export const compressImageApi = async (file, options = {}, onProgress) => {
  const formData = new FormData();
  formData.append('image', file);
  
  if (options.targetMode) formData.append('targetMode', options.targetMode);
  if (options.targetSizeKb) formData.append('targetSizeKb', options.targetSizeKb);
  if (options.minSizeKb) formData.append('minSizeKb', options.minSizeKb);
  if (options.maxSizeKb) formData.append('maxSizeKb', options.maxSizeKb);
  if (options.manualQuality) formData.append('manualQuality', options.manualQuality);
  if (options.outputFormat) formData.append('outputFormat', options.outputFormat);
  if (options.padToTarget !== undefined) formData.append('padToTarget', options.padToTarget);
  if (options.cleanBackground !== undefined) formData.append('cleanBackground', options.cleanBackground);
  if (options.exactTargetSize !== undefined) formData.append('exactTargetSize', options.exactTargetSize);

  const response = await apiClient.post('/api/images/compress', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export const resizeImageApi = async (file, options = {}, onProgress) => {
  const formData = new FormData();
  formData.append('image', file);

  if (options.resizeMode) formData.append('resizeMode', options.resizeMode);
  if (options.targetWidth) formData.append('targetWidth', options.targetWidth);
  if (options.targetHeight) formData.append('targetHeight', options.targetHeight);
  if (options.percentage) formData.append('percentage', options.percentage);
  if (options.maintainAspectRatio !== undefined) {
    formData.append('maintainAspectRatio', options.maintainAspectRatio);
  }
  if (options.quality) formData.append('quality', options.quality);
  if (options.outputFormat) formData.append('outputFormat', options.outputFormat);
  if (options.cleanBackground !== undefined) formData.append('cleanBackground', options.cleanBackground);

  const response = await apiClient.post('/api/images/resize', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export const convertImageApi = async (file, options = {}, onProgress) => {
  const formData = new FormData();
  formData.append('image', file);

  if (options.targetFormat) formData.append('targetFormat', options.targetFormat);
  if (options.quality) formData.append('quality', options.quality);

  const response = await apiClient.post('/api/images/convert', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export const editImageApi = async (file, options = {}, onProgress) => {
  const formData = new FormData();
  formData.append('image', file);

  if (options.rotation) formData.append('rotation', options.rotation);
  if (options.flipHorizontal !== undefined) formData.append('flipHorizontal', options.flipHorizontal);
  if (options.flipVertical !== undefined) formData.append('flipVertical', options.flipVertical);
  if (options.crop) formData.append('crop', JSON.stringify(options.crop));
  if (options.outputFormat) formData.append('outputFormat', options.outputFormat);
  if (options.quality) formData.append('quality', options.quality);

  const response = await apiClient.post('/api/images/edit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export const processBatchApi = async (files, options = {}, onProgress) => {
  const formData = new FormData();
  
  for (const file of files) {
    formData.append('images', file);
  }

  if (options.action) formData.append('action', options.action);
  if (options.targetMode) formData.append('targetMode', options.targetMode);
  if (options.targetSizeKb) formData.append('targetSizeKb', options.targetSizeKb);
  if (options.minSizeKb) formData.append('minSizeKb', options.minSizeKb);
  if (options.maxSizeKb) formData.append('maxSizeKb', options.maxSizeKb);
  if (options.manualQuality) formData.append('manualQuality', options.manualQuality);
  if (options.outputFormat) formData.append('outputFormat', options.outputFormat);
  if (options.percentage) formData.append('percentage', options.percentage);

  const response = await apiClient.post('/api/images/process-batch', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
};
