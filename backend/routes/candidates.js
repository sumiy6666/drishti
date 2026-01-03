const express = require('express');
const router = express.Router();
const candidatesCtrl = require('../controllers/candidates');
const auth = require('../middleware/auth');

// Only employers and admins can search candidates
router.get('/', auth.verify, auth.role(['employer', 'admin']), candidatesCtrl.list);
router.get('/:id', auth.verify, auth.role(['employer', 'admin']), candidatesCtrl.get);

module.exports = router;
