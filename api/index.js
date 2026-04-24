const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');

let isConnected = false;

module.exports = async (req, res) => {
    try {
        if (!isConnected) {
            await connectDB();
            isConnected = true;
        }
        // Ye line ensure karti hai ke Express handle kare request ko
        return app(req, res);
    } catch (error) {
        console.error("Vercel Function Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};