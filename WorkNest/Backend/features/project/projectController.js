const Project = require("./projectModel");
const User = require("../../models/User");

// Create Project
const createProject = async (req, res) => {
  try {
    // Get current user
    const user = await User.findById(req.user._id);

    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    // Only Owner and Manager can create projects
    if (!["owner", "manager"].includes(user.role)) {
      return res.status(403).json({
        message: "Only owner or manager can create projects",
      });
    }

    const { name, description, status } = req.body;

    // Validate project name
    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    // Create project
    const project = await Project.create({
      name,
      description,
      status: status || "planning",
      organization: user.organization,
      createdBy: user._id,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get Organization Projects
const getProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    const projects = await Project.find({
      organization: user.organization,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createProject,
  getProjects,
};