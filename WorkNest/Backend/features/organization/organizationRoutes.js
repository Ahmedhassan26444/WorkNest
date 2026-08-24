const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");

const {
  createOrganization,
  getMembers,
} = require("./organizationController");

const router = express.Router();

// ================= CREATE ORGANIZATION =================

router.post("/", authMiddleware, createOrganization);

// ================= GET ORGANIZATION MEMBERS =================

router.get("/members", authMiddleware, getMembers);

module.exports = router;

