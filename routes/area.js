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
// ====================== Image / File ========================
router.get(
  "/images",
  authToken,
  authRole(["admin","sale_user"]),
  areaController.viewAllImage("area")
);

router.post(
  "/images",
  authToken,
  authRole(["admin","sale_user"]),
  validator.image,
  areaController.uploadImage("area")
);

router.put(
  "/images/:imageId",
  authToken,
  authRole(["admin","sale_user"]),
  validator.image,
  areaController.editImage("area")
);

router.delete(
  "/images/:imageId",
  authToken,
  authRole(["admin","sale_user"]),
  validator.image,
  areaController.deleteImage("area")
);

router.get(
  "/files",
  authToken,
  authRole(["admin","sale_user"]),
  areaController.viewAllFile("area")
);

router.post(
  "/files",
  authToken,
  authRole(["admin","sale_user"]),
  validator.file,
  areaController.uploadFile("area")
);

router.put(
  "/files/:fileId",
  authToken,
  authRole(["admin","sale_user"]),
  validator.file,
  areaController.editFile("area")
);

router.delete(
  "/files/:fileId",
  authToken,
  authRole(["admin","sale_user"]),
  validator.file,
  areaController.deleteFile("area")
);

module.exports = router;
