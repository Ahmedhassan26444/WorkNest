const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    // check user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }


    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);


    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });


    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });


  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    // check user exists
    const user = await User.findOne({ email });


    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }


    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );


    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }


    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
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
      },
    });


  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




// Update Profile
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




// Change Password
const changePassword = async (req, res) => {
  try {

    const { oldPassword, newPassword } = req.body;


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


    // Save new password
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

// Delete Account
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

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

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
  deleteAccount,
};