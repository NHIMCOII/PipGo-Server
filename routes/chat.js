const express = require("express");

const chatController = require("../controllers/chat");

const router = express.Router();

router.get("/", chatController.chat);

module.exports = router;