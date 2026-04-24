const express = require('express');
const { registerCompany, getCompany, getCompanyById, updateCompany } = require('../controllers/companyController');
const isAuthenticated = require('../middleware/isAuthenticated');
const { singleUpload } = require('../middleware/multer');

const router = express.Router();

router.post('/register', isAuthenticated, registerCompany);
router.get('/get', isAuthenticated, getCompany);
router.get('/get/:id', isAuthenticated, getCompanyById);
router.put('/update/:id', isAuthenticated, singleUpload, updateCompany);

module.exports = router;
