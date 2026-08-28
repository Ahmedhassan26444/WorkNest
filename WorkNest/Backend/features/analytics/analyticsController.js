const Project = require("../project/projectModel");
const Task = require("../task/taskModel");
const User = require("../../models/User");

// ================= GET ANALYTICS =================

const getAnalytics = async (req, res) => {
try {
const organizationId = req.user.organization;


// ================= PROJECT ANALYTICS =================

const totalProjects = await Project.countDocuments({
  organization: organizationId,
});

const planningProjects = await Project.countDocuments({
  organization: organizationId,
  status: "planning",
});

const activeProjects = await Project.countDocuments({
  organization: organizationId,
  status: "active",
});

const completedProjects = await Project.countDocuments({
  organization: organizationId,
  status: "completed",
});

const onHoldProjects = await Project.countDocuments({
  organization: organizationId,
  status: "on-hold",
});

// ================= TASK ANALYTICS =================

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

// ================= TASK PRIORITY =================

const lowPriorityTasks = await Task.countDocuments({
  organization: organizationId,
  priority: "low",
});

const mediumPriorityTasks = await Task.countDocuments({
  organization: organizationId,
  priority: "medium",
});

const highPriorityTasks = await Task.countDocuments({
  organization: organizationId,
  priority: "high",
});

// ================= TEAM ANALYTICS =================

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

// ================= OVERDUE TASKS =================

const now = new Date();

const overdueTasks = await Task.countDocuments({
  organization: organizationId,
  dueDate: {
    $lt: now,
    $ne: null,
  },
  status: {
    $ne: "completed",
  },
});

// ================= TASKS PER TEAM MEMBER =================

const tasksPerMember = await Task.aggregate([
  {
    $match: {
      organization: organizationId,
      assignedTo: {
        $ne: null,
      },
    },
  },
  {
    $group: {
      _id: "$assignedTo",
      total: {
        $sum: 1,
      },
      todo: {
        $sum: {
          $cond: [{ $eq: ["$status", "todo"] }, 1, 0],
        },
      },
      inProgress: {
        $sum: {
          $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0],
        },
      },
      completed: {
        $sum: {
          $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
        },
      },
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $unwind: {
      path: "$user",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      _id: 0,
      userId: "$_id",
      name: {
        $ifNull: ["$user.name", "$user.fullName"],
      },
      email: "$user.email",
      total: 1,
      todo: 1,
      inProgress: 1,
      completed: 1,
    },
  },
  {
    $sort: {
      total: -1,
    },
  },
]);

// ================= PROJECT-WISE TASK PROGRESS =================

const projectTaskProgress = await Task.aggregate([
  {
    $match: {
      organization: organizationId,
    },
  },
  {
    $group: {
      _id: "$project",
      total: {
        $sum: 1,
      },
      todo: {
        $sum: {
          $cond: [{ $eq: ["$status", "todo"] }, 1, 0],
        },
      },
      inProgress: {
        $sum: {
          $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0],
        },
      },
      completed: {
        $sum: {
          $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
        },
      },
    },
  },
  {
    $lookup: {
      from: "projects",
      localField: "_id",
      foreignField: "_id",
      as: "project",
    },
  },
  {
    $unwind: {
      path: "$project",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      _id: 0,
      projectId: "$_id",
      name: "$project.name",
      total: 1,
      todo: 1,
      inProgress: 1,
      completed: 1,
      completionRate: {
        $cond: [
          { $gt: ["$total", 0] },
          {
            $round: [
              {
                $multiply: [
                  {
                    $divide: ["$completed", "$total"],
                  },
                  100,
                ],
              },
              0,
            ],
          },
          0,
        ],
      },
    },
  },
  {
    $sort: {
      total: -1,
    },
  },
]);

// ================= COMPLETION RATE =================

const completionRate =
  totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

// ================= RESPONSE =================

res.status(200).json({
  success: true,
  analytics: {
    projects: {
      total: totalProjects,
      planning: planningProjects,
      active: activeProjects,
      completed: completedProjects,
      onHold: onHoldProjects,
    },

    tasks: {
      total: totalTasks,
      todo: todoTasks,
      inProgress: inProgressTasks,
      completed: completedTasks,
    },

    priorities: {
      low: lowPriorityTasks,
      medium: mediumPriorityTasks,
      high: highPriorityTasks,
    },

    team: {
      total: totalMembers,
      owners,
      managers,
      employees,
    },

    overdueTasks,

    tasksPerMember,

    projectTaskProgress,

    completionRate,
  },
});

} catch (error) {
console.error("Analytics Error:", error);

res.status(500).json({
  success: false,
  message: "Failed to fetch analytics",
});


}
};

module.exports = {
getAnalytics,
};