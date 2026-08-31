const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
require("dotenv").config();

const authRoutes = require("./features/auth/authRoutes");
const userRoutes = require("./features/user/userRoutes");
const organizationRoutes = require("./features/organization/organizationRoutes");
const memberRoutes = require("./features/organization/memberRoutes");
const projectRoutes = require("./features/project/projectRoutes");
const taskRoutes = require("./features/task/taskRoutes");
const dashboardRoutes = require("./features/dashboard/dashboardRoutes");
const analyticsRoutes = require("./features/analytics/analyticsRoutes");
const app = express();


// Database
connectDB();


// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/organization", memberRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("WorkNest Backend Running");
});


// Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});