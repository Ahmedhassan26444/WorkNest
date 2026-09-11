const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const {
  createOrganization,
  getMembers,
  addMember,
  deleteMember,
} = require("./organizationController");

const {
  createInvitation,
  acceptInvitation,
} = require("./invitationController");

const router = express.Router();

// ================= CREATE ORGANIZATION =================

router.post("/", authMiddleware, createOrganization);

// ================= GET ORGANIZATION MEMBERS =================

router.get("/members", authMiddleware, getMembers);

// ================= ADD ORGANIZATION MEMBER =================

router.post("/members", authMiddleware, addMember);

// ================= DELETE ORGANIZATION MEMBER =================

router.delete(
  "/members/:memberId",
  authMiddleware,
  deleteMember
);

// ================= CREATE INVITATION =================

router.post(
  "/invitations",
  authMiddleware,
  createInvitation
);

// ================= ACCEPT INVITATION =================

router.post(
  "/invitations/accept",
  acceptInvitation
);

module.exports = router;
