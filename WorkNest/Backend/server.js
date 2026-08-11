const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();


// Database
connectDB();


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("RentFlow Backend Running");
});


// Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});