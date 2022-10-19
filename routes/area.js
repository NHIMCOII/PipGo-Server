const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const {} = require("../middlewares/permission");
const validator = require("../middlewares/validator");
const areaController = require("../controllers/area");

const router = express.Router();
// Remember to add permission middleware when got full insight
router.get("/list", authToken, authRole(["admin","sale_user"]), areaController.areaList);

router.post(
  "/add",
  authToken,
  authRole(["admin","sale_user"]),
  validator.area,
  areaController.addArea
);

router.put(
  "/update/:areaId",
  authToken,
  authRole(["admin","sale_user"]),
  validator.area,
  areaController.updateArea
);

router.delete(
  "/delete/:areaId",
  authToken,
  authRole(["admin","sale_user"]),
  areaController.deleteArea
);

module.exports = router;
