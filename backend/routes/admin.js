const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin');
const auth = require('../middleware/auth');

router.get('/users', auth.verify, auth.role('admin'), adminCtrl.users);
router.delete('/users/:id', auth.verify, auth.role('admin'), adminCtrl.deleteUser);
router.get('/jobs', auth.verify, auth.role('admin'), adminCtrl.jobs);
router.delete('/jobs/:id', auth.verify, auth.role('admin'), adminCtrl.deleteJob);
router.get('/analytics', auth.verify, auth.role('admin'), adminCtrl.analytics);

module.exports = router;
