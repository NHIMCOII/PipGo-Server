const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const authController = require("../controllers/auth");
const validator = require("../middlewares/validator");
const router = express.Router();

router.post(
  "/register",
  authToken,
  authRole(["admin"]),
  validator.userInfo,
  authController.register
);

router.post("/login", validator.login, authController.login);

router.post("/token", authController.generateToken);

router.put(
  "/newPassword/:token",
  validator.newPassword,
  authController.newPassword
);

router.post("/reset", validator.reset, authController.reset);

router.post("/logout", authToken, authController.logout);

module.exports = router;
