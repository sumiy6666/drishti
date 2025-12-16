const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/me', authCtrl.me);
router.get('/verify/:token', authCtrl.verifyEmail);
router.post('/forgot', authCtrl.forgotPassword);
router.post('/reset/:token', authCtrl.resetPassword);

// Middleware for protected routes
const authMiddleware = require('../middleware/auth');
router.put('/profile', authMiddleware.verify, authCtrl.updateProfile);

module.exports = router;
