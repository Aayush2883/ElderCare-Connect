import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

// Load environment variables immediately to support hoisted ESM imports
dotenv.config();

// Check if Cloudinary environment variables are available
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;
let storage;

if (isCloudinaryConfigured) {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Storage engine for Cloudinary
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const isPdf = file.fieldname === 'degreeDocument';
      return {
        folder: 'eldercare_uploads',
        resource_type: isPdf ? 'raw' : 'image',
        public_id: file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9),
        format: isPdf ? 'pdf' : undefined,
      };
    },
  });
} else {
  // Make sure local uploads directory exists
  const uploadDir = './uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Storage engine configuration
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate unique name: fieldname-timestamp-random.ext
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
}

// File filter validation
const fileFilter = (req, file, cb) => {
  const filetypes = {
    profilePhoto: /jpeg|jpg|png/,
    degreeDocument: /pdf/,
  };

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (file.fieldname === 'profilePhoto') {
    const isImageExt = filetypes.profilePhoto.test(extname);
    const isImageMime = mimetype.startsWith('image/');
    
    if (isImageExt && isImageMime) {
      return cb(null, true);
    } else {
      return cb(new Error('Profile photo must be an image (jpg, jpeg, or png)'));
    }
  }

  if (file.fieldname === 'degreeDocument') {
    const isPdfExt = filetypes.degreeDocument.test(extname);
    const isPdfMime = mimetype === 'application/pdf';

    if (isPdfExt && isPdfMime) {
      return cb(null, true);
    } else {
      return cb(new Error('Degree document must be a PDF file'));
    }
  }

  cb(new Error('Unexpected field name for upload'));
};

// Limits config (e.g. 25MB max file size)
const limits = {
  fileSize: 25 * 1024 * 1024, // 25MB
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});

