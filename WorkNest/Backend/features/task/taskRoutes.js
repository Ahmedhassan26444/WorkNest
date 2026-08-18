const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("./taskController");

const router = express.Router();


// Get all organization tasks
// Owner, Manager, Employee
router.get(
  "/",
  authMiddleware,
  roleMiddleware("owner", "manager", "employee"),
  getTasks
);


// Create task
// Owner, Manager
router.post(
  "/",
  authMiddleware,
  roleMiddleware("owner", "manager"),
  createTask
);


// Get single task
// Owner, Manager, Employee
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("owner", "manager", "employee"),
  getTask
);


// Update task
// Owner, Manager, Employee
// Additional permission check happens inside controller
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("owner", "manager", "employee"),
  updateTask
);


// Delete task
// Owner, Manager
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("owner", "manager"),
  deleteTask
);


module.exports = router;