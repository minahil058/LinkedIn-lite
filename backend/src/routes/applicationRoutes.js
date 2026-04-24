const express = require('express');
const { applyJob, getAppliedJobs, getApplicants, updateStatus } = require('../controllers/applicationController');
const isAuthenticated = require('../middleware/isAuthenticated');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/apply/:id', isAuthenticated, authorizeRoles('candidate'), applyJob);
router.get('/get', isAuthenticated, getAppliedJobs);
router.get('/:id/applicants', isAuthenticated, authorizeRoles('recruiter', 'admin'), getApplicants);
router.post('/status/:id/update', isAuthenticated, authorizeRoles('recruiter', 'admin'), updateStatus);

module.exports = router;
