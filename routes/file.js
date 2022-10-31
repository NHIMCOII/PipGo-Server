const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const upload_multer = require("../middlewares/upload-multer");
const validator = require("../middlewares/validator");
const fileController = require("../controllers/file");

const router = express.Router();

// ====================== Area File ========================

router.get("/area", fileController.viewAllFile("area"));

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
  fileController.uploadFile("area")
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
  fileController.editFile("area")
);

router.delete(
  "/area/:fileId",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.file,
  fileController.deleteFile("area")
);

// ====================== House File ========================

router.get("/house", fileController.viewAllFile("house"));

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
  fileController.uploadFile("house")
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
  fileController.editFile("house")
);

router.delete(
  "/house/:fileId",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.file,
  fileController.deleteFile("house")
);

module.exports = router;
