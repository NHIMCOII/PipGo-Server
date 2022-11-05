const fs = require("fs");
const path = require("path");
const config = require("config");
const { validationResult } = require("express-validator");

const AreaFile = require("../models/areaFile");
const HouseFile = require("../models/houseFile");

exports.viewAllFile = (type) => {
  return async (req, res, next) => {
    try {
      const { areaId, houseId } = req.query;
      let list = [];
      if (type == "area") {
        list = await AreaFile.find({ area_id: areaId });
      } else if (type == "house") {
        list = await HouseFile.find({ house_id: houseId });
      } else {
        const err = new Error("Type must be area or house");
        err.statusCode = 400;
        throw err;
      }

      res.status(200).json({ message: "Fetched all area files", files: list });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};

exports.uploadFile = (type) => {
  return async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const { name, areaId, houseId, desc } = req.body;
      if (!req.files.file) {
        const error = new Error("No file provided");
        error.statusCode = 422;
        throw error;
      }
      const url = req.files.file[0].path.replace(/\\/g, "/");
      let imageUrl;
      if (req.files.image) {
        imageUrl = req.files.image[0].path.replace(/\\/g, "/");
      }

      let result;
      if (type == "area") {
        result = new AreaFile({
          name: name,
          area_id: areaId,
          url: url,
          imageUrl: imageUrl,
          desc: desc,
        });
      } else if (type == "house") {
        result = new HouseFile({
          name: name,
          house_id: houseId,
          url: url,
          imageUrl: imageUrl,
          desc: desc,
        });
      } else {
        const err = new Error("Type must be area or house");
        err.statusCode = 400;
        throw err;
      }

      await result.save();
      res
        .status(201)
        .json({ message: "Upload file successfully", file: result });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};

exports.editFile = (type) => {
  return async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const { name, desc } = req.body;
      const fileId = req.params.fileId;
      let check_file = null;
      if (type == "area") {
        check_file = await AreaFile.findById(fileId);
      } else if (type == "house") {
        check_file = await HouseFile.findById(fileId);
      } else {
        const err = new Error("Type must be area or house");
        err.statusCode = 400;
        throw err;
      }
      if (!check_file) {
        const err = new Error("File not exists");
        err.statusCode = 404;
        throw err;
      }
      check_file.name = name;
      if (req.files.file) {
        clearFile(check_file.url);
        check_file.url = req.files.file[0].path.replace(/\\/g, "/");
      }
      if (req.files.image) {
        if (check_file.imageUrl) {
          clearFile(check_file.imageUrl);
        }
        check_file.imageUrl = req.files.image[0].path.replace(/\\/g, "/");
      }
      check_file.desc = desc;
      await check_file.save();
      res
        .status(201)
        .json({ message: "Edited file successfully", file: check_file });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};

exports.deleteFile = (type) => {
  return async (req, res, next) => {
    try {
      const fileId = req.params.fileId;
      if (type == "area") {
        const check_file = await AreaFile.findById(fileId);
        clearFile(check_file.url);
        clearFile(check_file.imageUrl);
        await AreaFile.deleteOne({ _id: fileId });
      } else if (type == "house") {
        const check_file = await HouseFile.findById(fileId);
        clearFile(check_file.url);
        if (check_file.imageUrl) {
          clearFile(check_file.imageUrl);
        }
        await HouseFile.deleteOne({ _id: fileId });
      } else {
        const err = new Error("Type must be area or house");
        err.statusCode = 400;
        throw err;
      }
      res.status(200).json({ message: "File Deleted" });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};

const clearFile = (filePath) => {
  if (filePath != config.get("default.avatar")) {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
};
