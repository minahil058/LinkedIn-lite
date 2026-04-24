const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/errorMiddleware');

const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const companyRoutes = require('./routes/companyRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true }));
app.use(morgan('dev'));
app.use(cookieParser()); // Initialized before routes

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/application', applicationRoutes);
app.use('/api/v1/company', companyRoutes);

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to Job Portal API",
        dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        success: true
    });
});

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
