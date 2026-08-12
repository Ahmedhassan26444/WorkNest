const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");

const router = express.Router();

// Protected route - Get Profile
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile accessed successfully",
    user: req.user,
  });
});

// Protected route - Update Profile
router.put("/profile", authMiddleware, updateProfile);

// Protected route - Change Password
router.put("/change-password", authMiddleware, changePassword);

// Protected route - Delete Account
router.delete("/account", authMiddleware, deleteAccount);

module.exports = router;