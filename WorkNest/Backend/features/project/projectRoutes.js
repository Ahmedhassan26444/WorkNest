const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
  createProject,
  getProjects,
} = require("./projectController");

const router = express.Router();


// Create Project
// Owner and Manager only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("owner", "manager"),
  createProject
);


// Get Organization Projects
// Owner, Manager, and Employee can view projects
router.get(
  "/",
  authMiddleware,
  roleMiddleware("owner", "manager", "employee"),
  getProjects
);


module.exports = router;