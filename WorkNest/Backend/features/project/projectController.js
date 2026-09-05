const Project = require("./projectModel");
const User = require("../../models/User");
const Notification = require("../../models/Notification");

// Create Project

const createProject = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    if (!["owner", "manager"].includes(user.role)) {
      return res.status(403).json({
        message: "Only owner or manager can create projects",
      });
    }

    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
      status: status || "planning",
      organization: user.organization,
      createdBy: user._id,
    });

    // Create notifications for other organization members

    const members = await User.find({
      organization: user.organization,
      _id: { $ne: user._id },
    });

    const notifications = members.map((member) => ({
      user: member._id,
      organization: user.organization,
      type: "project_created",
      title: "New Project Created",
      message: `${user.name} created a new project "${project.name}"`,
      relatedProject: project._id,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

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

// Search Organization Projects

const searchProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const projects = await Project.find({
      organization: user.organization,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { status: { $regex: query, $options: "i" } },
      ],
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Projects search completed successfully",
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Project

const getProject = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      organization: user.organization,
    }).populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project fetched successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Project

const updateProject = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    if (!["owner", "manager"].includes(user.role)) {
      return res.status(403).json({
        message: "Only owner or manager can update projects",
      });
    }

    const { name, description, status } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      organization: user.organization,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (name !== undefined) {
      project.name = name;
    }

    if (description !== undefined) {
      project.description = description;
    }

    if (status !== undefined) {
      project.status = status;
    }

    await project.save();

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Project

const deleteProject = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    if (user.role !== "owner") {
      return res.status(403).json({
        message: "Only the organization owner can delete projects",
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      organization: user.organization,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Save project name before deleting
    const projectName = project.name;

    // Get other organization members
    const members = await User.find({
      organization: user.organization,
      _id: { $ne: user._id },
    });

    // Create notifications for other members
    const notifications = members.map((member) => ({
      user: member._id,
      organization: user.organization,
      type: "project_deleted",
      title: "Project Deleted",
      message: `${user.name} deleted the project "${projectName}"`,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    // Delete project
    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully",
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
  searchProjects,
  getProject,
  updateProject,
  deleteProject,
};