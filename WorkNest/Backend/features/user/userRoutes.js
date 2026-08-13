const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");

const {
  updateProfile,
  changePassword,
  deleteAccount,
} = require("./userController");

const router = express.Router();

// Get Profile
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile accessed successfully",
    user: req.user,
  });
});

// Update Profile
router.put("/profile", authMiddleware, updateProfile);

// Change Password
router.put("/change-password", authMiddleware, changePassword);

// Delete Account
router.delete("/account", authMiddleware, deleteAccount);

module.exports = router;