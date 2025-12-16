const express = require('express');
const router = express.Router();
const msgCtrl = require('../controllers/messages');
const auth = require('../middleware/auth');

router.post('/', auth.verify, msgCtrl.sendMessage);
router.get('/conversations/:userId', auth.verify, msgCtrl.getConversation);
router.get('/inbox', auth.verify, msgCtrl.inbox);

module.exports = router;
