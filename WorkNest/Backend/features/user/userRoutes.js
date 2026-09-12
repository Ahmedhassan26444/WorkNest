const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");

const User = require("../../models/User");

const {
  updateProfile,
  changePassword,
  deleteAccount,
} = require("./userController");

const router = express.Router();

// Get Profile

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("organization", "name");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile accessed successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Update Profile

router.put("/profile", authMiddleware, updateProfile);

// Change Password

router.put("/change-password", authMiddleware, changePassword);

// Delete Account

router.delete("/account", authMiddleware, deleteAccount);

module.exports = router;

