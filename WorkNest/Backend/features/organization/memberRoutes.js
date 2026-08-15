const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");

const {
  addMember,
  getMembers,
} = require("./memberController");

const router = express.Router();

// Add member to organization
router.post("/members", authMiddleware, addMember);

// Get organization members
router.get("/members", authMiddleware, getMembers);

module.exports = router;