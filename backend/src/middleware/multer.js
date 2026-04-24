const multer = require('multer');

const storage = multer.memoryStorage();

// Middleware to handle single file upload (e.g. company logo)
const singleUpload = multer({ storage }).single("file");

// Middleware to handle multiple fields (Resume and Profile Photo)
// Updated field names to match user request: 'resume' and 'profilePhoto'
const multipleUpload = multer({ storage }).fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
]);

module.exports = { singleUpload, multipleUpload };