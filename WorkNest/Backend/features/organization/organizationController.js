const Organization = require("../../models/Organization");
const User = require("../../models/User");

// Create Organization
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
    await User.findByIdAndUpdate(
      req.user._id,
      {
        organization: organization._id,
        role: "owner",
      }
    );

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

module.exports = {
  createOrganization,
};