const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const validator = require("../middlewares/validator");
const categoryController = require("../controllers/category");
const { tryCatch } = require("../middlewares/errorHandler");

const router = express.Router();

router.get("/area", tryCatch(categoryController.viewCategory("area")));

router.get("/house", tryCatch(categoryController.viewCategory("house")));

router.post(
  "/areaAdd",
  authToken,
  authRole(["editor", "admin"]),
  validator.category,
  tryCatch(categoryController.addCategory("area"))
);

router.post(
  "/houseAdd",
  authToken,
  authRole(["editor", "admin"]),
  validator.category,
  tryCatch(categoryController.addCategory("house"))
);

router.put(
  "/areaUpdate/:categoryId",
  authToken,
  authRole(["editor", "admin"]),
  validator.category,
  tryCatch(categoryController.updateCategory("area"))
);

router.put(
  "/houseUpdate/:categoryId",
  authToken,
  authRole(["editor", "admin"]),
  validator.category,
  tryCatch(categoryController.updateCategory("house"))
);

router.delete(
  "/areaDelete/:categoryId",
  authToken,
  authRole(["editor", "admin"]),
  tryCatch(categoryController.deleteCategory("area"))
);

router.delete(
  "/houseDelete/:categoryId",
  authToken,
  authRole(["editor", "admin"]),
  tryCatch(categoryController.deleteCategory("house"))
);

module.exports = router;
