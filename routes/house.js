const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const upload_multer = require("../middlewares/upload-multer");
const validator = require("../middlewares/validator");
const houseController = require("../controllers/house");

const { tryCatch } = require("../middlewares/errorHandler");

const router = express.Router();
// Remember to add permission middleware when got full insight
router.get(
  "/list",
  authToken,
  authRole(["admin", "sale_user"]),
  tryCatch(houseController.houseList)
);

router.post(
  "/add",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.image.single("avatar"),
  validator.house,
  tryCatch(houseController.addHouse)
);

router.put(
  "/update/:houseId",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.image.single("avatar"),
  validator.house,
  tryCatch(houseController.updateHouse)
);

router.delete(
  "/delete/:houseId",
  authToken,
  authRole(["admin", "sale_user"]),
  tryCatch(houseController.deleteHouse)
);

module.exports = router;
