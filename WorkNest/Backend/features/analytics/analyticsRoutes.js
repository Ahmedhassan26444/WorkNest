const express = require("express");

const router = express.Router();

const { getAnalytics } = require("./analyticsController");

const authMiddleware = require("../../middleware/authMiddleware");

router.get("/", authMiddleware, getAnalytics);

module.exports = router;