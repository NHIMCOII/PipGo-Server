const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const upload_multer = require("../middlewares/upload-multer");
const validator = require("../middlewares/validator");
const houseController = require("../controllers/house");

const router = express.Router();
// Remember to add permission middleware when got full insight
router.get(
  "/list",
  authToken,
  authRole(["admin", "sale_user"]),
  houseController.houseList
);

router.post(
  "/add",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.image.single("avatar"),
  validator.house,
  houseController.addHouse
);

router.put(
  "/update/:houseId",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.image.single("avatar"),
  validator.house,
  houseController.updateHouse
);

router.delete(
  "/delete/:houseId",
  authToken,
  authRole(["admin", "sale_user"]),
  houseController.deleteHouse
);

module.exports = router;
