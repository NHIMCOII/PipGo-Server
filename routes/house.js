const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const {} = require("../middlewares/permission");
const validator = require("../middlewares/validator");
const houseController = require("../controllers/house");
// use areaController to handle files & images for both area and house
const areaController = require("../controllers/area");

const router = express.Router();
// Remember to add permission middleware when got full insight
router.get("/list", authToken, authRole(["admin","sale_user"]), houseController.houseList);

router.post(
  "/add",
  authToken,
  authRole(["admin","sale_user"]),
  validator.house,
  houseController.addHouse
);

router.put(
  "/update/:houseId",
  authToken,
  authRole(["admin","sale_user"]),
  validator.house,
  houseController.updateHouse
);

router.delete(
  "/delete/:houseId",
  authToken,
  authRole(["admin","sale_user"]),
  houseController.deleteHouse
);
// // ====================== Image / File ========================
router.get(
  "/images",
  authToken,
  authRole(["admin","sale_user"]),
  areaController.viewAllImage("house")
);

router.post(
  "/images",
  authToken,
  authRole(["admin","sale_user"]),
  validator.image,
  areaController.uploadImage("house")
);

router.put(
  "/images/:imageId",
  authToken,
  authRole(["admin","sale_user"]),
  validator.image,
  areaController.editImage("house")
);

router.delete(
  "/images/:imageId",
  authToken,
  authRole(["admin","sale_user"]),
  validator.image,
  areaController.deleteImage("house")
);

router.get(
  "/files",
  authToken,
  authRole(["admin","sale_user"]),
  areaController.viewAllFile("house")
);

router.post(
  "/files",
  authToken,
  authRole(["admin","sale_user"]),
  validator.file,
  areaController.uploadFile("house")
);

router.put(
  "/files/:fileId",
  authToken,
  authRole(["admin","sale_user"]),
  validator.file,
  areaController.editFile("house")
);

router.delete(
  "/files/:fileId",
  authToken,
  authRole(["admin","sale_user"]),
  validator.file,
  areaController.deleteFile("house")
);

module.exports = router;
