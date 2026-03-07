const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/me', authCtrl.me);
router.post('/verify-otp', authCtrl.verifyOtp);
router.post('/resend-otp', authCtrl.resendOtp);
router.post('/forgot', authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);

// Middleware for protected routes
const authMiddleware = require('../middleware/auth');
router.put('/profile', authMiddleware.verify, authCtrl.updateProfile);
router.get('/profile/:id', authCtrl.getPublicProfile);

module.exports = router;
