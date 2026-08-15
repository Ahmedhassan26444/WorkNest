const User = require("../../models/User");
const Organization = require("../../models/Organization");

// Add Member to Organization
const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;

    // Check email
    if (!email) {
      return res.status(400).json({
        message: "Member email is required",
      });
    }

    // Find current user's organization
    const currentUser = await User.findById(req.user._id);

    if (!currentUser || !currentUser.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    // Only owner can add members
    if (currentUser.role !== "owner") {
      return res.status(403).json({
        message: "Only the organization owner can add members",
      });
    }

    // Find member
    const member = await User.findOne({ email });

    if (!member) {
      return res.status(404).json({
        message: "User not found. User must register first.",
      });
    }

    // Check if already in an organization
    if (member.organization) {
      return res.status(400).json({
        message: "User already belongs to an organization",
      });
    }

    // Validate role
    const allowedRoles = ["manager", "employee"];
    const memberRole = role || "employee";

    if (!allowedRoles.includes(memberRole)) {
      return res.status(400).json({
        message: "Invalid role. Use manager or employee",
      });
    }

    // Add member to organization
    member.organization = currentUser.organization;
    member.role = memberRole;

    await member.save();

    res.status(200).json({
      message: "Member added successfully",
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        organization: member.organization,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get Organization Members
const getMembers = async (req, res) => {
  try {
    // Find current user
    const currentUser = await User.findById(req.user._id);

    if (!currentUser || !currentUser.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    // Find all members of the same organization
    const members = await User.find({
      organization: currentUser.organization,
    }).select("-password");

    res.status(200).json({
      message: "Organization members fetched successfully",
      members,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  addMember,
  getMembers,
};