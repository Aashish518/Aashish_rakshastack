// Import required packages
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Set up CloudinaryStorage for multer to upload files to Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'pg-images', // All uploaded images will be stored inside this folder in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'] // Only allow image formats
    }
});

// Create multer instance with Cloudinary storage configuration
const upload = multer({ storage });

// Export the configured multer upload instance to use in routes
module.exports = upload;
