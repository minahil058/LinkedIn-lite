const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testConnection = async () => {
    console.log("--- MongoDB Atlas Connection Test ---");
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
        console.error("❌ Error: MONGO_URI is not defined in your .env file.");
        process.exit(1);
    }

    // Sanitize URI for logging (mask password)
    const maskedUri = uri.replace(/:([^@]+)@/, ":****@");
    console.log("Connecting to:", maskedUri);

    try {
        await mongoose.connect(uri);
        console.log('✅ SUCCESS: MongoDB Atlas connected perfectly!');
        console.log('Database Name:', mongoose.connection.name);
        process.exit(0);
    } catch (error) {
        console.error('❌ FAILURE: Connection failed.');
        console.log('\nDetailed Error Info:');
        console.log('--------------------');
        console.log('Name:', error.name);
        console.log('Message:', error.message);
        
        if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
            console.log('\n--- AUTHENTICATION TIPS ---');
            console.log('1. User Check: Go to "Database Access" in Atlas. Ensure "zaheerminahil95_db_user" exists.');
            console.log('2. Privilege: Ensure the user has "Atlas Admin" or "Read and Write to any database" roles.');
            console.log('3. Password: If your password contains @, #, $, or !, encode it using https://www.urlencoder.org/');
            console.log('4. IP Access: Go to "Network Access" in Atlas. Ensure your IP is added (or use 0.0.0.0/0).');
        }
        process.exit(1);
    }
};

testConnection();
