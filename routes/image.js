const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const upload_multer = require("../middlewares/upload-multer");
const validator = require("../middlewares/validator");
const imageController = require("../controllers/image");

const router = express.Router();

// ====================== Area Image  ========================

router.get("/area", imageController.viewAllImage("area"));

router.post(
  "/area",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.image.single("image"),
  validator.image,
  imageController.uploadImage("area")
);

router.put(
  "/area/:imageId",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.image.single("image"),
  validator.image,
  imageController.editImage("area")
);

router.delete(
  "/area/:imageId",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.image,
  imageController.deleteImage("area")
);

// ====================== House Image  ========================

router.get("/house", imageController.viewAllImage("house"));

router.post(
  "/house",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.image.single("image"),
  validator.image,
  imageController.uploadImage("house")
);

router.put(
  "/house/:imageId",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.image.single("image"),
  validator.image,
  imageController.editImage("house")
);

router.delete(
  "/house/:imageId",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.image,
  imageController.deleteImage("house")
);

module.exports = router;
