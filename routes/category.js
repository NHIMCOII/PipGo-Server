const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const validator = require("../middlewares/validator");
const categoryController = require("../controllers/category");

const router = express.Router();

router.get(
    "/areaCategory",
    categoryController.viewCategory("area")
  );
  
  router.get(
    "/houseCategory",
    categoryController.viewCategory("house")
  );
  
  router.post(
    "/addAreaCategory",
    authToken,
    authRole(["editor", "admin"]),
    validator.category,
    categoryController.addCategory("area")
  );
  
  router.post(
    "/addHouseCategory",
    authToken,
    authRole(["editor", "admin"]),
    validator.category,
    categoryController.addCategory("house")
  );
  
  router.put(
    "/updateAreaCategory/:categoryId",
    authToken,
    authRole(["editor", "admin"]),
    validator.category,
    categoryController.updateCategory("area")
  );
  
  router.put(
    "/updateHouseCategory/:categoryId",
    authToken,
    authRole(["editor", "admin"]),
    validator.category,
    categoryController.updateCategory("house")
  );
  
  router.delete(
    "/deleteAreaCategory/:categoryId",
    authToken,
    authRole(['editor',"admin"]),
    categoryController.deleteCategory('area')
  );
  
  router.delete(
    "/deleteHouseCategory/:categoryId",
    authToken,
    authRole(['editor',"admin"]),
    categoryController.deleteCategory('house')
  );

module.exports = router;
