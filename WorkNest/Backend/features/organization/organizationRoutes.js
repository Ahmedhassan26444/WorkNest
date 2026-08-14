const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");

const {
  createOrganization,
} = require("./organizationController");

const router = express.Router();

// Create Organization
router.post("/", authMiddleware, createOrganization);

module.exports = router;
