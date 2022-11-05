const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const {} = require("../middlewares/permission");
const validator = require("../middlewares/validator");
const searchController = require("../controllers/search");

const router = express.Router();

router.get("/filter", validator.filter, searchController.filter);

router.get("/houseList", searchController.houseList);

router.get("/area/:areaId", searchController.area);

router.get("/house/:houseId", searchController.house);

router.get("/location", searchController.location);

module.exports = router;
