const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');

// Database connection helper
const connect = async () => {
    try {
        await connectDB();
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection failed:", err);
        throw err;
    }
};

module.exports = async (req, res) => {
    // Vercel ki request handle karne ke liye
    try {
        await connect();
        // Express app handle logic
        return app(req, res);
    } catch (error) {
        console.error("Vercel Function Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};