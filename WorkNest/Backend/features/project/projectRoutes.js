const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("./projectController");

const router = express.Router();


// Get all organization projects
// Owner, Manager, Employee
router.get(
  "/",
  authMiddleware,
  roleMiddleware("owner", "manager", "employee"),
  getProjects
);


// Create project
// Owner, Manager
router.post(
  "/",
  authMiddleware,
  roleMiddleware("owner", "manager"),
  createProject
);


// Get single project
// Owner, Manager, Employee
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("owner", "manager", "employee"),
  getProject
);


// Update project
// Owner, Manager
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("owner", "manager"),
  updateProject
);


// Delete project
// Owner only
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("owner"),
  deleteProject
);


module.exports = router;