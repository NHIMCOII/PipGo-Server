const express = require("express");

const { authToken, authRole } = require("../middlewares/is-auth");
const {} = require("../middlewares/permission");
const validator = require("../middlewares/validator");
const fileImageController = require("../controllers/fileImage");

const router = express.Router();

// ====================== Area Image / File ========================

router.get(
  "/area_images",
  fileImageController.viewAllImage("area")
);

router.post(
  "/area_images",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.image,
  fileImageController.uploadImage("area")
);

router.put(
  "/area_images/:imageId",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.image,
  fileImageController.editImage("area")
);

router.delete(
  "/area_images/:imageId",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.image,
  fileImageController.deleteImage("area")
);

router.get(
  "/area_files",
  fileImageController.viewAllFile("area")
);

router.post(
  "/area_files",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.file,
  fileImageController.uploadFile("area")
);

router.put(
  "/area_files/:fileId",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.file,
  fileImageController.editFile("area")
);

router.delete(
  "/area_files/:fileId",
  authToken,
  authRole(["admin", "sale_user"]),
  validator.file,
  fileImageController.deleteFile("area")
);

// ====================== House Image / File ========================

router.get(
    "/house_images",
    fileImageController.viewAllImage("house")
  );
  
  router.post(
    "/house_images",
    authToken,
    authRole(["admin","sale_user"]),
    validator.image,
    fileImageController.uploadImage("house")
  );
  
  router.put(
    "/house_images/:imageId",
    authToken,
    authRole(["admin","sale_user"]),
    validator.image,
    fileImageController.editImage("house")
  );
  
  router.delete(
    "/house_images/:imageId",
    authToken,
    authRole(["admin","sale_user"]),
    validator.image,
    fileImageController.deleteImage("house")
  );
  
  router.get(
    "/house_files",
    fileImageController.viewAllFile("house")
  );
  
  router.post(
    "/house_files",
    authToken,
    authRole(["admin","sale_user"]),
    validator.file,
    fileImageController.uploadFile("house")
  );
  
  router.put(
    "/house_files/:fileId",
    authToken,
    authRole(["admin","sale_user"]),
    validator.file,
    fileImageController.editFile("house")
  );
  
  router.delete(
    "/house_files/:fileId",
    authToken,
    authRole(["admin","sale_user"]),
    validator.file,
    fileImageController.deleteFile("house")
  );

module.exports = router;
