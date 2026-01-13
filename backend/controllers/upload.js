const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const path = require('path');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Configure storage
let storage;

if (process.env.AWS_BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  console.log("Using S3 Storage");
  const s3 = new AWS.S3();
  storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `resumes/${Date.now()}-${file.originalname}`);
    }
  });
} else {
  console.log("AWS Credentials missing. Falling back to Local Storage.");
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
}).single('file');

exports.uploadFile = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // req.file.location is for S3, req.file.filename is for Local
    const fileUrl = req.file.location || `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.key || req.file.filename });
  });
};
