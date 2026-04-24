const express = require('express');
const { register, login, logout, updateProfile, saveJob, getSavedJobs } = require('../controllers/userController');
const isAuthenticated = require('../middleware/isAuthenticated');
const { multipleUpload } = require('../middleware/multer');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/profile/update', isAuthenticated, multipleUpload, updateProfile);

// Bookmark Routes
router.post('/save/:id', isAuthenticated, saveJob);
router.get('/getsavedjobs', isAuthenticated, getSavedJobs);

module.exports = router;
