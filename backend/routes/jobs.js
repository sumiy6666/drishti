const express = require('express');
const router = express.Router();
const jobsCtrl = require('../controllers/jobs');
const auth = require('../middleware/auth');

router.get('/my-applications', auth.verify, auth.role('jobseeker'), jobsCtrl.myApplications);
router.get('/application/:id', auth.verify, auth.role(['employer', 'admin']), jobsCtrl.getApplicationDetails);
router.get('/', jobsCtrl.list); // search, filter, pagination
router.get('/:id', jobsCtrl.get);
router.post('/', auth.verify, auth.role('employer'), jobsCtrl.create);
router.put('/:id', auth.verify, auth.role('employer'), jobsCtrl.update);
router.delete('/:id', auth.verify, auth.role('employer'), jobsCtrl.remove);

router.post('/:id/apply', auth.verify, auth.role('jobseeker'), jobsCtrl.apply);
router.post('/:id/save', auth.verify, auth.role('jobseeker'), jobsCtrl.toggleSave);
router.get('/:id/applications', auth.verify, auth.role(['employer', 'admin']), jobsCtrl.getApplications);

router.post('/saved-search', auth.verify, jobsCtrl.saveSearch);
router.get('/saved-search', auth.verify, jobsCtrl.getSavedSearches);

module.exports = router;
