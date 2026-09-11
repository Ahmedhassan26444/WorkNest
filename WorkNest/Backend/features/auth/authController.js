const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../../models/User");
const Organization = require("../../models/Organization");

// ======================================================
// Email Transporter
// ======================================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ======================================================
// Register User + Create Organization
// ======================================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      organizationName,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !organizationName
    ) {
      return res.status(400).json({
        message:
          "Name, email, password and organization name are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Token expires in 24 hours
    const verificationExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    // --------------------------------------------------
    // 1. Create User
    // --------------------------------------------------

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "owner",
      organization: null,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    try {
      // ------------------------------------------------
      // 2. Create Organization
      // ------------------------------------------------

      const organization = await Organization.create({
        name: organizationName,
        owner: user._id,
      });

      // ------------------------------------------------
      // 3. Connect User with Organization
      // ------------------------------------------------

      user.organization = organization._id;
      await user.save();

      // ------------------------------------------------
      // 4. Send Verification Email
      // ------------------------------------------------

      const verificationUrl =
        `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Verify your WorkNest email",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Welcome to WorkNest</h2>

            <p>Hello ${user.name},</p>

            <p>
              Thank you for creating your WorkNest account.
              Please verify your email address by clicking the button below.
            </p>

            <p>
              <a
                href="${verificationUrl}"
                style="
                  display: inline-block;
                  padding: 12px 20px;
                  background: #2563eb;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                "
              >
                Verify Email
              </a>
            </p>

            <p>
              This verification link will expire in 24 hours.
            </p>

            <p>
              If you did not create this account, you can ignore this email.
            </p>
          </div>
        `,
      });

      // ------------------------------------------------
      // 5. Send Response
      // ------------------------------------------------

      return res.status(201).json({
        message:
          "Account and organization created successfully. Please check your email to verify your account.",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organization: user.organization,
          profilePhoto: user.profilePhoto || null,
          isEmailVerified: user.isEmailVerified,
        },

        organization: {
          id: organization._id,
          name: organization.name,
          owner: organization.owner,
        },
      });
    } catch (organizationError) {
      // If organization/email process fails,
      // remove the newly created user
      await User.findByIdAndDelete(user._id);

      throw organizationError;
    }
  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// Verify Email
// ======================================================

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("Email Verification Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// Login User
// ======================================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email }).populate(
      "organization",
      "name"
    );

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Check email verification
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message:
          "Please verify your email before logging in",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        organization: user.organization?._id || null,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization || null,
        profilePhoto: user.profilePhoto || null,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// Update Profile
// ======================================================

const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// Upload Profile Photo
// ======================================================

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete old photo if it exists
    if (user.profilePhoto) {
      const oldPhotoPath = path.join(
        __dirname,
        "../../",
        user.profilePhoto
      );

      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Save new photo path
    user.profilePhoto = `/uploads/${req.file.filename}`;

    await user.save();

    const userResponse = user.toObject();

    delete userResponse.password;

    res.status(200).json({
      message: "Profile photo uploaded successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// Delete Profile Photo
// ======================================================

const deleteProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.profilePhoto) {
      return res.status(400).json({
        message: "No profile photo to delete",
      });
    }

    const photoPath = path.join(
      __dirname,
      "../../",
      user.profilePhoto
    );

    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }

    user.profilePhoto = null;

    await user.save();

    const userResponse = user.toObject();

    delete userResponse.password;

    res.status(200).json({
      message: "Profile photo deleted successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// Change Password
// ======================================================

const changePassword = async (req, res) => {
  try {
    const {
      oldPassword,
      newPassword,
    } = req.body;

    // Find current user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check old password
    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// Delete Account
// ======================================================

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// Exports
// ======================================================

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  updateProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  changePassword,
  deleteAccount,
};