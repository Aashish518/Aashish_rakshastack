const jwt = require("jsonwebtoken");

// Middleware to protect routes
const auth = (req, res, next) => {
    // Get token from request header
    const authHeader = req.header("Authorization");

    // token not found
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Extract token after "Bearer"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. Invalid token format." });
    }

    try {
        // Verify the token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to the request
        req.user = decoded;

        // Continue to the next middleware or route
        next();
    } catch (err) {
        // If token is invalid, return error
        res.status(400).json({ message: "Invalid token" });
    }
};

module.exports = auth;
