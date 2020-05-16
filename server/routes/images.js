const express = require('express');
const router = express.Router();
const multer = require('multer');

const UserController = require('../controllers/user');
const ImageController = require('../controllers/image');

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
    }
  }

const upload = multer({
    limits: { fieldSize: 4 * 1024 * 1024 },
    fileFilter
})

router.post('', UserController.authMiddleware, upload.single('image'), ImageController.uploadImage);

module.exports = router;