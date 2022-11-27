const express = require("express");

const chatController = require("../controllers/chat");
const { tryCatch } = require("../middlewares/errorHandler");

const router = express.Router();

router.get("/distribute", tryCatch(chatController.chat));

module.exports = router;
