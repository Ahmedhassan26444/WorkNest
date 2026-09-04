const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("./notificationController");

const router = express.Router();

router.get("/", authMiddleware, getNotifications);

router.get("/unread-count", authMiddleware, getUnreadCount);

router.patch("/:id/read", authMiddleware, markAsRead);

router.patch("/read-all", authMiddleware, markAllAsRead);

module.exports = router;