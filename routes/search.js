const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const {} = require("../middlewares/permission");
const validator = require("../middlewares/validator");
const searchController = require("../controllers/search");

const { tryCatch } = require("../middlewares/errorHandler");

const router = express.Router();

router.get("/filter", validator.filter, tryCatch(searchController.filter));

router.get("/houseList", tryCatch(searchController.houseList));

router.get("/area/:areaId", tryCatch(searchController.area));

router.get("/house/:houseId", tryCatch(searchController.house));

router.get("/location", tryCatch(searchController.location));

module.exports = router;
