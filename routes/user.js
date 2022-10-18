const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const { canViewProfile } = require("../middlewares/permission");
const validator = require("../middlewares/validator");
const userController = require("../controllers/user");

const router = express.Router();

// ================================== Account ==================================
router.post(
  "/register",
  authToken,
  authRole(["admin"]),
  validator.profile,
  userController.register
);

router.get(
  "/profile/:userId",
  authToken,
  authRole(["admin", "editor", "sale_user"]),
  canViewProfile,
  userController.profile
);

router.put(
  "/profile/:userId",
  authToken,
  authRole(["admin", "editor", "sale_user"]),
  canViewProfile,
  validator.profile,
  userController.updateProfile
);

router.put(
  "/updatePassword/:userId",
  authToken,
  authRole(["admin", "editor", "sale_user"]),
  canViewProfile,
  validator.updatePassword,
  userController.updatePassword
);

router.get("/list", authToken, authRole(["admin"]), userController.userList);

router.delete(
  "/delete/:userId",
  authToken,
  authRole(["admin"]),
  userController.deleteAccount
);

module.exports = router;
