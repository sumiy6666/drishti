const express = require('express');
const router = express.Router();
const notificationCtrl = require('../controllers/notifications');
const auth = require('../middleware/auth');

router.get('/', auth.verify, notificationCtrl.list);
router.put('/:id/read', auth.verify, notificationCtrl.markRead);
router.put('/read-all', auth.verify, notificationCtrl.markAllRead);

module.exports = router;
