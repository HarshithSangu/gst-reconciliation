const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Extract Bearer token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.slice(7); // Remove "Bearer " prefix
    }

    // Return 401 if no token
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token with JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded.id and attach to req.user
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if user isActive is true
    if (!req.user.isActive) {
      return res.status(403).json({ message: "Account deactivated" });
    }

    // Call next() at the end
    next();
  } catch (error) {
    // Return 401 if token invalid
    return res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = { protect };
