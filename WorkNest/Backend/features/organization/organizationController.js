const Organization = require("../../models/Organization");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

// ================= CREATE ORGANIZATION =================

const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;

    // Check organization name
    if (!name) {
      return res.status(400).json({
        message: "Organization name is required",
      });
    }

    // Create organization
    const organization = await Organization.create({
      name,
      owner: req.user._id,
    });

    // Connect organization with current user
    await User.findByIdAndUpdate(req.user._id, {
      organization: organization._id,
      role: "owner",
    });

    res.status(201).json({
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ORGANIZATION MEMBERS =================

const getMembers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check user organization
    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    // Get members from same organization
    const members = await User.find({
      organization: user.organization,
    }).select("name email role");

    res.status(200).json({
      message: "Members fetched successfully",
      members,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= ADD ORGANIZATION MEMBER =================

const addMember = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check user organization
    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    // Only Owner and Manager can add members
    if (!["owner", "manager"].includes(user.role)) {
      return res.status(403).json({
        message: "Only owner or manager can add members",
      });
    }

    const { name, email, password, role } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Only employee can be added for now
    if (role !== "employee") {
      return res.status(400).json({
        message: "Only employee can be added",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Hash employee password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee
    const member = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      organization: user.organization,
    });

    res.status(201).json({
      message: "Employee added successfully",
      member: {
        _id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE ORGANIZATION MEMBER =================

const deleteMember = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check user organization
    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    // Only Owner and Manager can delete members
    if (!["owner", "manager"].includes(user.role)) {
      return res.status(403).json({
        message: "Only owner or manager can delete members",
      });
    }

    const { memberId } = req.params;

    const member = await User.findById(memberId);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // Member must belong to same organization
    if (
      member.organization.toString() !==
      user.organization.toString()
    ) {
      return res.status(403).json({
        message: "Member does not belong to your organization",
      });
    }

    // Owner cannot be deleted
    if (member.role === "owner") {
      return res.status(403).json({
        message: "Owner cannot be deleted",
      });
    }

    // Manager cannot delete another manager
    if (user.role === "manager" && member.role === "manager") {
      return res.status(403).json({
        message: "Manager cannot delete another manager",
      });
    }

    await User.findByIdAndDelete(memberId);

    res.status(200).json({
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ================= EXPORT CONTROLLERS =================

module.exports = {
  createOrganization,
  getMembers,
  addMember,
  deleteMember,
};