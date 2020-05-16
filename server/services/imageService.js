const multer = require("multer");

const upload = multer({
    fileFilter,
    storage: multerS3({
      acl: 'public-read',
      s3,
      bucket: 'bwm-ng-dev',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: 'TESTING_METADATA'});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  });
  
  module.exports = upload;