const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const { canViewProfile } = require("../middlewares/permission");
const validator = require("../middlewares/validator");
const userController = require("../controllers/user");

const router = express.Router();

router.get(
  "/profile/:userId",
  authToken,
  authRole(["admin", "editor", "sale"]),
  canViewProfile, //each user can view their own profile while admin can view all
  userController.profile
);

router.put(
  "/profile/:userId",
  authToken,
  authRole(["admin", "editor", "sale"]),
  canViewProfile,
  validator.userInfo,
  userController.updateProfile
);

router.get("/list", authToken, authRole(["admin"]), userController.userList);

router.delete(
  "/delete/:userId",
  authToken,
  authRole(["admin"]),
  userController.deleteAccount
);

module.exports = router;
