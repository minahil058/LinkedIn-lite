const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.id);

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: `Role: ${user.role} is not allowed to access this resource`,
          success: false
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        message: "Error checking user role",
        success: false
      });
    }
  };
};

module.exports = authorizeRoles;
