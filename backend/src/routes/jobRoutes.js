const express = require('express');
const { postJob, getAllJobs, getJobById, getAdminJobs, updateJob, saveJob, getSavedJobs } = require('../controllers/jobController');
const isAuthenticated = require('../middleware/isAuthenticated');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/post', isAuthenticated, authorizeRoles('recruiter', 'admin'), postJob);
router.get('/get', getAllJobs);
router.get('/getadminjobs', isAuthenticated, authorizeRoles('recruiter', 'admin'), getAdminJobs);
router.get('/get/:id', getJobById);
router.put('/update/:id', isAuthenticated, authorizeRoles('recruiter', 'admin'), updateJob);

module.exports = router;
