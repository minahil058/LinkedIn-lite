require('dotenv').config(); // Load environment variables first
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 8000;

// Connect to database and then start server
const startServer = async () => {
    try {
        await connectDB();
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.log(`Error: ${err.message}`);
            console.log('Shutting down the server due to Unhandled Promise Rejection');
            server.close(() => {
                process.exit(1);
            });
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
