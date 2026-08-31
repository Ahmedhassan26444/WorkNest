const express = require("express");

const {
  registerUser,
  loginUser,
  uploadProfilePhoto,
  deleteProfilePhoto,
} = require("./authController");

const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Upload Profile Photo
router.post(
  "/profile-photo",
  authMiddleware,
  upload.single("profilePhoto"),
  uploadProfilePhoto
);

// Delete Profile Photo
router.delete(
  "/profile-photo",
  authMiddleware,
  deleteProfilePhoto
);

module.exports = router;