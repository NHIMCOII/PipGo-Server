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

// =========================== Category ============================
router.get(
  "/areaCategory",
  authToken,
  authRole(["editor", "admin", "sale_user"]),
  userController.viewCategory("area")
);

router.get(
  "/houseCategory",
  authToken,
  authRole(["editor", "admin", "host", "sale_user"]),
  userController.viewCategory("house")
);

router.post(
  "/addAreaCategory",
  authToken,
  authRole(["editor", "admin"]),
  validator.category,
  userController.addCategory("area")
);

router.post(
  "/addHouseCategory",
  authToken,
  authRole(["editor", "admin"]),
  validator.category,
  userController.addCategory("house")
);

router.put(
  "/updateAreaCategory/:categoryId",
  authToken,
  authRole(["editor", "admin"]),
  validator.category,
  userController.updateCategory("area")
);

router.put(
  "/updateHouseCategory/:categoryId",
  authToken,
  authRole(["editor", "admin"]),
  validator.category,
  userController.updateCategory("house")
);

router.delete(
  "/deleteAreaCategory/:categoryId",
  authToken,
  authRole(['editor',"admin"]),
  userController.deleteCategory('area')
);

router.delete(
  "/deleteHouseCategory/:categoryId",
  authToken,
  authRole(['editor',"admin"]),
  userController.deleteCategory('house')
);

module.exports = router;
