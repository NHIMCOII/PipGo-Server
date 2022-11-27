const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const upload_multer = require("../middlewares/upload-multer");
const validator = require("../middlewares/validator");
const imageController = require("../controllers/image");

const { tryCatch } = require("../middlewares/errorHandler");

const router = express.Router();

// ====================== Area Image  ========================

router.get("/area", tryCatch(imageController.viewAllImage("area")));

router.post(
  "/area",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.image.single("image"),
  validator.image,
  tryCatch(imageController.uploadImage("area"))
);

router.put(
  "/area/:imageId",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.image.single("image"),
  validator.image,
  tryCatch(imageController.editImage("area"))
);

router.delete(
  "/area/:imageId",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.image,
  tryCatch(imageController.deleteImage("area"))
);

// ====================== House Image  ========================

router.get("/house", tryCatch(imageController.viewAllImage("house")));

router.post(
  "/house",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.image.single("image"),
  validator.image,
  tryCatch(imageController.uploadImage("house"))
);

router.put(
  "/house/:imageId",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.image.single("image"),
  validator.image,
  tryCatch(imageController.editImage("house"))
);

router.delete(
  "/house/:imageId",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.image,
  tryCatch(imageController.deleteImage("house"))
);

module.exports = router;
