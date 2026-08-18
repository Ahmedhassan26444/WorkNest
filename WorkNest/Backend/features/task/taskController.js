const Task = require("./taskModel");
const Project = require("../project/projectModel");
const User = require("../../models/User");


// Create Task
const createTask = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    // Only Owner and Manager can create tasks
    if (!["owner", "manager"].includes(user.role)) {
      return res.status(403).json({
        message: "Only owner or manager can create tasks",
      });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    if (!project) {
      return res.status(400).json({
        message: "Project is required",
      });
    }

    // Check project belongs to user's organization
    const projectExists = await Project.findOne({
      _id: project,
      organization: user.organization,
    });

    if (!projectExists) {
      return res.status(404).json({
        message: "Project not found in your organization",
      });
    }

    // Check assigned user
    if (assignedTo) {
      const assignedUser = await User.findOne({
        _id: assignedTo,
        organization: user.organization,
      });

      if (!assignedUser) {
        return res.status(404).json({
          message: "Assigned user not found in your organization",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      dueDate: dueDate || null,
      project,
      organization: user.organization,
      assignedTo: assignedTo || null,
      createdBy: user._id,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get Organization Tasks
const getTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    const tasks = await Task.find({
      organization: user.organization,
    })
      .populate("project", "name status")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get Single Task
const getTask = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      organization: user.organization,
    })
      .populate("project", "name status")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Update Task
const updateTask = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      organization: user.organization,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
    } = req.body;

    // Owner and Manager can update any task
    // Employee can update only their assigned task
    const isManagerOrOwner = ["owner", "manager"].includes(user.role);
    const isAssignedEmployee =
      user.role === "employee" &&
      task.assignedTo &&
      task.assignedTo.toString() === user._id.toString();

    if (!isManagerOrOwner && !isAssignedEmployee) {
      return res.status(403).json({
        message: "You do not have permission to update this task",
      });
    }

    // If project is being changed, validate organization
    if (project !== undefined) {
      const projectExists = await Project.findOne({
        _id: project,
        organization: user.organization,
      });

      if (!projectExists) {
        return res.status(404).json({
          message: "Project not found in your organization",
        });
      }

      task.project = project;
    }

    // If assignedTo is being changed, validate organization
    if (assignedTo !== undefined) {
      if (assignedTo === null || assignedTo === "") {
        task.assignedTo = null;
      } else {
        const assignedUser = await User.findOne({
          _id: assignedTo,
          organization: user.organization,
        });

        if (!assignedUser) {
          return res.status(404).json({
            message: "Assigned user not found in your organization",
          });
        }

        task.assignedTo = assignedTo;
      }
    }

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (status !== undefined) {
      task.status = status;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("project", "name status")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Delete Task
const deleteTask = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    // Only Owner and Manager can delete tasks
    if (!["owner", "manager"].includes(user.role)) {
      return res.status(403).json({
        message: "Only owner or manager can delete tasks",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      organization: user.organization,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};