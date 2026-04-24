const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');

// Connect to database if not already connected
// (Vercel serverless functions might reuse the container)
let cachedDb = null;

module.exports = async (req, res) => {
    if (!cachedDb) {
        await connectDB();
        cachedDb = true;
    }
    return app(req, res);
};
