const express = require('express');
const router = express.Router();
const mailer = require('../utils/mailer');

// POST /api/test-email
// Body: { to: 'email@example.com' }
router.post('/', async (req, res) => {
    try {
        const { to } = req.body;
        if (!to) {
            return res.status(400).json({ error: 'Recipient email "to" is required' });
        }

        console.log(`Sending test email to ${to}...`);
        const info = await mailer.send({
            to,
            subject: 'Job Portal - Test Email',
            html: '<h1>Test Email</h1><p>This is a test email from the Job Portal production readiness check.</p>',
            text: 'Test Email. This is a test email from the Job Portal production readiness check.'
        });

        console.log('Email sent:', info);
        res.json({ message: 'Email sent successfully', info });
    } catch (err) {
        console.error('Error sending test email:', err);
        res.status(500).json({ error: 'Failed to send email', details: err.message });
    }
});

module.exports = router;
