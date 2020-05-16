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
const imageUpload = upload.single('image');

router.post('', UserController.authMiddleware, (req, res, next) => {
    imageUpload(req, res, (err) => {
        if (err){
            return res.status(422).send({errors: [{title: 'Image Upload Error', detail: 'Image too big'}]});
        }
        next();
    })
}, ImageController.uploadImage);

module.exports = router;