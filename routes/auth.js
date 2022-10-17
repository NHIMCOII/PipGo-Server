const express = require("express");

const { authToken } = require("../middlewares/is-auth");
const authController = require("../controllers/auth");
const validator = require("../middlewares/validator");
const router = express.Router();

router.post("/login", validator.login, authController.login);

router.post("/token", authController.generateToken);

router.put("/reset/:token", validator.resetPassword, authController.resetPassword);

router.post("/reset", validator.reset, authController.reset);

router.post("/logout", authToken, authController.logout);

module.exports = router;
