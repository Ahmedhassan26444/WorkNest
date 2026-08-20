const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
  getDashboard,
} = require("./dashboardController");

const router = express.Router();


// Get organization dashboard
// Owner, Manager, Employee
router.get(
  "/",
  authMiddleware,
  roleMiddleware("owner", "manager", "employee"),
  getDashboard
);


module.exports = router;