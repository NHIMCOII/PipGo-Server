const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const validator = require("../middlewares/validator");
const categoryController = require("../controllers/category");

const router = express.Router();

router.get("/area", categoryController.viewCategory("area"));

router.get("/house", categoryController.viewCategory("house"));

router.post(
  "/areaAdd",
  authToken,
  authRole(["editor", "admin"]),
  validator.category,
  categoryController.addCategory("area")
);

router.post(
  "/houseAdd",
  authToken,
  authRole(["editor", "admin"]),
  validator.category,
  categoryController.addCategory("house")
);

router.put(
  "/areaUpdate/:categoryId",
  authToken,
  authRole(["editor", "admin"]),
  validator.category,
  categoryController.updateCategory("area")
);

router.put(
  "/houseUpdate/:categoryId",
  authToken,
  authRole(["editor", "admin"]),
  validator.category,
  categoryController.updateCategory("house")
);

router.delete(
  "/areaDelete/:categoryId",
  authToken,
  authRole(["editor", "admin"]),
  categoryController.deleteCategory("area")
);

router.delete(
  "/houseDelete/:categoryId",
  authToken,
  authRole(["editor", "admin"]),
  categoryController.deleteCategory("house")
);

module.exports = router;
