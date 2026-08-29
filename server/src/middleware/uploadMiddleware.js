import multer from 'multer';
import { SUPPORTED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '../config/constants.js';

// Use memory storage for efficient stream & buffer processing with Sharp
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (SUPPORTED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      `Unsupported file type: ${file.mimetype}. Only JPG, JPEG, PNG, and WEBP images are supported.`
    );
    error.code = 'UNSUPPORTED_FILE_TYPE';
    cb(error, false);
  }
};

export const uploadSingle = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  },
  fileFilter
}).single('image');

export const uploadMultiple = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  },
  fileFilter
}).array('images', 20);
