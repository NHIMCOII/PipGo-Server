const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    return cb(new Error("Only Image Format Allowed"));
  }
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // setting destination of uploading files
    if (file.fieldname === "file") {
      // if uploading resume
      cb(null, "public/files");
    } else {
      // else uploading image
      cb(null, "public/images");
    }
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "file") {
    // if uploading resume
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      return cb(new Error("Only File Format Allowed")); // else fails
    }
  } else {
    // else uploading image
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      return cb(new Error("Only Image Format Allowed")); // else fails
    }
  }
};

exports.image = multer({ storage: imageStorage, fileFilter: imageFilter })

exports.file = multer({
  storage: fileStorage,
  limits: {
    fileSize: "2mb",
  },
  fileFilter: fileFilter,
});
