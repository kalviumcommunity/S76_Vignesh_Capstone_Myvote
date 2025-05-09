// middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'election_symbols',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `symbol_${Date.now()}`
  }
});

const upload = multer({ storage });

module.exports = upload;
