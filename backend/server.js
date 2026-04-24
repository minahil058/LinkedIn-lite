require('dotenv').config(); // Load environment variables first
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 8000;

// Connect to database
connectDB();

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
