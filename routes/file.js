const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const upload_multer = require("../middlewares/upload-multer");
const validator = require("../middlewares/validator");
const fileController = require("../controllers/file");

const { tryCatch } = require("../middlewares/errorHandler");

const router = express.Router();

// ====================== Area File ========================

router.get("/area", tryCatch(fileController.viewAllFile("area")));

router.post(
  "/area",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.file.fields([
    {
      name: "file",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  validator.file,
  tryCatch(fileController.uploadFile("area"))
);

router.put(
  "/area/:fileId",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.file.fields([
    {
      name: "file",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  validator.file,
  tryCatch(fileController.editFile("area"))
);

router.delete(
  "/area/:fileId",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.file,
  tryCatch(fileController.deleteFile("area"))
);

// ====================== House File ========================

router.get("/house", tryCatch(fileController.viewAllFile("house")));

router.post(
  "/house",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.file.fields([
    {
      name: "file",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  validator.file,
  tryCatch(fileController.uploadFile("house"))
);

router.put(
  "/house/:fileId",
  authToken,
  authRole(["admin", "sale_user"]),
  upload_multer.file.fields([
    {
      name: "file",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  validator.file,
  tryCatch(fileController.editFile("house"))
);

router.delete(
  "/house/:fileId",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.file,
  tryCatch(fileController.deleteFile("house"))
);

module.exports = router;
