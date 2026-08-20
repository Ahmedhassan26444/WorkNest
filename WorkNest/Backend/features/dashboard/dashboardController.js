const User = require("../../models/User");
const Project = require("../project/projectModel");
const Task = require("../task/taskModel");


// Get Organization Dashboard
const getDashboard = async (req, res) => {
  try {
    // Get current user
    const user = await User.findById(req.user._id);

    if (!user || !user.organization) {
      return res.status(400).json({
        message: "You are not part of an organization",
      });
    }

    const organizationId = user.organization;

    // Get projects
    const totalProjects = await Project.countDocuments({
      organization: organizationId,
    });

    const activeProjects = await Project.countDocuments({
      organization: organizationId,
      status: "active",
    });

    const completedProjects = await Project.countDocuments({
      organization: organizationId,
      status: "completed",
    });

    const planningProjects = await Project.countDocuments({
      organization: organizationId,
      status: "planning",
    });

    const onHoldProjects = await Project.countDocuments({
      organization: organizationId,
      status: "on-hold",
    });


    // Get tasks
    const totalTasks = await Task.countDocuments({
      organization: organizationId,
    });

    const todoTasks = await Task.countDocuments({
      organization: organizationId,
      status: "todo",
    });

    const inProgressTasks = await Task.countDocuments({
      organization: organizationId,
      status: "in-progress",
    });

    const completedTasks = await Task.countDocuments({
      organization: organizationId,
      status: "completed",
    });


    // Get overdue tasks
    const overdueTasks = await Task.countDocuments({
      organization: organizationId,
      dueDate: {
        $lt: new Date(),
      },
      status: {
        $ne: "completed",
      },
    });


    // Get team members
    const totalMembers = await User.countDocuments({
      organization: organizationId,
    });

    const owners = await User.countDocuments({
      organization: organizationId,
      role: "owner",
    });

    const managers = await User.countDocuments({
      organization: organizationId,
      role: "manager",
    });

    const employees = await User.countDocuments({
      organization: organizationId,
      role: "employee",
    });


    // Send dashboard data
    res.status(200).json({
      message: "Dashboard data fetched successfully",

      dashboard: {
        projects: {
          total: totalProjects,
          active: activeProjects,
          completed: completedProjects,
          planning: planningProjects,
          onHold: onHoldProjects,
        },

        tasks: {
          total: totalTasks,
          todo: todoTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
          overdue: overdueTasks,
        },

        team: {
          total: totalMembers,
          owners,
          managers,
          employees,
        },
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  getDashboard,
};