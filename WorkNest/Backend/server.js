const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const authRoutes = require("./features/auth/authRoutes");
const userRoutes = require("./features/user/userRoutes");
const organizationRoutes = require("./features/organization/organizationRoutes");

const app = express();

// Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/organization", organizationRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("WorkNest Backend Running");
});

// Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});