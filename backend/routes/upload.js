const express = require('express');
const router = express.Router();
const uploadCtrl = require('../controllers/upload');
const auth = require('../middleware/auth');

router.post('/', auth.verify, uploadCtrl.uploadFile);

module.exports = router;
