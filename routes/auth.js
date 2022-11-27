const express = require("express");

const { authToken } = require("../middlewares/is-auth");
const authController = require("../controllers/auth");
const validator = require("../middlewares/validator");

const { tryCatch } = require("../middlewares/errorHandler");

const router = express.Router();

router.post("/login", validator.login, tryCatch(authController.login));

router.post("/token", tryCatch(authController.generateToken));

router.put(
  "/reset/:token",
  validator.resetPassword,
  tryCatch(authController.resetPassword)
);

router.post("/reset", validator.reset, tryCatch(authController.reset));

router.post("/logout", authToken, tryCatch(authController.logout));

module.exports = router;
