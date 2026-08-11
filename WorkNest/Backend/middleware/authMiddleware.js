const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "No token, access denied",
      });
    }

    // Remove Bearer word
    const tokenValue = token.replace("Bearer ", "");

    // Verify token
    const decoded = jwt.verify(
      tokenValue,
      process.env.JWT_SECRET
    );

    // Find user from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Add user data to request
    req.user = user;

    next();

  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;