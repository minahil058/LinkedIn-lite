const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong MongoDB ID error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new Error(message);
    err.statusCode = 400;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new Error(message);
    err.statusCode = 400;
  }

  // Wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = `JSON Web Token is invalid. Try again!!!`;
    err = new Error(message);
    err.statusCode = 400;
  }

  // JWT EXPIRED error
  if (err.name === 'TokenExpiredError') {
    const message = `JSON Web Token is expired. Try again!!!`;
    err = new Error(message);
    err.statusCode = 400;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorMiddleware;
