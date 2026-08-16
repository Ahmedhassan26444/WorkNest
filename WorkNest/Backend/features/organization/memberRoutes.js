const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const {
  addMember,
  getMembers,
} = require("./memberController");
const router = express.Router();
router.post(
  "/members",
  authMiddleware,
  roleMiddleware("owner"),
  addMember
);
router.get(
  "/members",
  authMiddleware,
  roleMiddleware("owner", "manager"),
  getMembers
);
module.exports = router;