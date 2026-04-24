const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            })
        }
        const secret = process.env.SECRET_KEY || process.env.JWT_SECRET;
        if (!secret) {
            console.error("Authentication Middleware Error: SECRET_KEY or JWT_SECRET is missing");
            return res.status(500).json({ message: "Server configuration error", success: false });
        }
        const decode = jwt.verify(token, secret);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            })
        };
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error during authentication",
            success: false
        });
    }
}

module.exports = isAuthenticated;
