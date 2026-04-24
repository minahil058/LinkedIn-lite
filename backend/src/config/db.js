const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // Specific check for Authentication failures
    if (error.message.includes('auth failed') || error.message.includes('Authentication failed')) {
        console.error('CRITICAL: Check your MongoDB Username and Password in .env');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
