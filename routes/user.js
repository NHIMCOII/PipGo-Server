const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const { canViewProfile } = require("../middlewares/permission");
const validator = require("../middlewares/validator");
const userController = require("../controllers/user");

const { tryCatch } = require("../middlewares/errorHandler");

const router = express.Router();

// ================================== Account ==================================
router.post(
  "/register",
  authToken,
  authRole(["admin"]),
  validator.profile,
  tryCatch(userController.register)
);

router.get(
  "/profile/:userId",
  authToken,
  authRole(["admin", "editor", "sale_user"]),
  canViewProfile,
  tryCatch(userController.profile)
);

router.put(
  "/profile/:userId",
  authToken,
  authRole(["admin", "editor", "sale_user"]),
  canViewProfile,
  validator.profile,
  tryCatch(userController.updateProfile)
);

router.put(
  "/updatePassword/:userId",
  authToken,
  authRole(["admin", "editor", "sale_user"]),
  canViewProfile,
  validator.updatePassword,
  tryCatch(userController.updatePassword)
);

router.get(
  "/list",
  authToken,
  authRole(["admin"]),
  tryCatch(userController.userList)
);

router.delete(
  "/delete/:userId",
  authToken,
  authRole(["admin"]),
  tryCatch(userController.deleteAccount)
);

module.exports = router;
