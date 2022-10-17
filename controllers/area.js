const { validationResult } = require("express-validator");

const Area = require("../models/area");
const House = require("../models/house");
const AreaImage = require("../models/areaImage");
const HouseImage = require("../models/houseImage");
const AreaFile = require("../models/areaFile");
const HouseFile = require("../models/houseFile");
const Province = require("../models/province");
const ProvinceStatus = require("../models/provinceStatus");
const provinceHelper = require("../utils/provinceStatus_helper");
exports.areaList = async (req, res, next) => {
  try {
    const list = await Area.find();
    res.status(200).json({ message: "Fetched all areas", list: list });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addArea = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { provinceId, name, capacity, minPrice, maxPrice } = req.body;

    const check_area = await Area.findOne({
      name: name,
      province_id: provinceId,
    });

    if (check_area) {
      const err = new Error(
        "This name is already taken, please pick a different one"
      );
      err.statusCode = 404;
      throw err;
    }

    const area = new Area({
      province_id: provinceId,
      name: name,
      capacity: new Number(capacity),
      price: {
        min: minPrice,
        max: maxPrice,
      },
    });

    provinceHelper.add(provinceId);
    await area.save();

    res.status(201).json({ message: "New Area Created", area: area });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateArea = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const {
      status,
      provinceId,
      name,
      capacity,
      minPrice,
      maxPrice,
      avatar,
      desc,
      video,
    } = req.body;
    const areaId = req.params.areaId;
    const check_area = await Area.findById(areaId);

    if (!check_area) {
      const err = new Error("Area not found");
      err.statusCode = 404;
      throw err;
    }
    const check_name = await Area.findOne({
      name: name,
      province_id: provinceId,
    });

    if (check_name && name != check_area.name) {
      const err = new Error(
        "This name is already taken, please pick a different one"
      );
      err.statusCode = 400;
      throw err;
    }

    provinceHelper.update(check_area.province_id, provinceId);
    check_area.status = status;
    check_area.province_id = provinceId;
    check_area.name = name;
    check_area.capacity = capacity;
    check_area.price.min = minPrice;
    check_area.price.max = maxPrice;
    check_area.avatar = avatar;
    check_area.desc = desc;
    check_area.video = video;
    await check_area.save();

    res
      .status(200)
      .json({ message: "Updated Area Successfully", area: check_area });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteArea = async (req, res, next) => {
  try {
    const areaId = req.params.areaId;
    const check_area = await Area.findById(areaId);
    const check_province = await Province.findById(check_area.province_id)
    const check_provinceStatus = await ProvinceStatus.findOne({name: check_province.name,district: check_province.district})
    check_provinceStatus.status --
    check_provinceStatus.save()
    await Area.deleteOne({ _id: areaId });
    await House.deleteMany({ area_id: areaId });
    // Remember to delete house's files and images, do FE need url to delete images and files
    // AreaFile.deleteMany({ area_id: areaId });
    // AreaImage.deleteMany({ area_id: areaId });

    res.status(200).json({ message: "Area Deleted" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// ========================= Upload file/image ==========================

exports.viewAllImage = (type) => {
  return async (req, res, next) => {
    try {
      const { areaId, houseId } = req.body;
      let list = [];
      if (type == "area") {
        list = await AreaImage.find({ area_id: areaId });
      } else if (type == "house") {
        list = await HouseImage.find({ house_id: houseId });
      } else {
        res.status(404).json({ error: "Type must be area or house" });
      }

      res
        .status(200)
        .json({ message: "Fetched all area images", images: list });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};

exports.uploadImage = (type) => {
  return async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const { categoryId, areaId, houseId, url, desc } = req.body;
      let result;
      if (type == "area") {
        result = new AreaImage({
          category_id: categoryId,
          area_id: areaId,
          url: url,
          desc: desc,
        });
      } else if (type == "house") {
        result = new HouseImage({
          category_id: categoryId,
          house_id: houseId,
          url: url,
          desc: desc,
        });
      } else {
        res.status(404).json({ error: "Type must be area or house" });
      }

      await result.save();
      res
        .status(201)
        .json({ message: "Upload image successfully", image: result });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};

exports.editImage = (type) => {
  return async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const { categoryId, url, desc } = req.body;
      const imageId = req.params.imageId;
      let check_image = null;
      if (type == "area") {
        check_image = await AreaImage.findById(imageId);
      } else if (type == "house") {
        check_image = await HouseImage.findById(imageId);
      } else {
        res.status(404).json({ error: "Type must be area or house" });
      }
      if (!check_image) {
        const err = new Error("Image not exists");
        err.statusCode = 404;
        throw err;
      }

      check_image.category_id = categoryId;
      check_image.url = url;
      check_image.desc = desc;
      await check_image.save();
      res
        .status(201)
        .json({ message: "Edited image successfully", image: check_image });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};

exports.deleteImage = (type) => {
  return async (req, res, next) => {
    try {
      const imageId = req.params.imageId;
      if (type == "area") {
        await AreaImage.deleteOne({ _id: imageId });
      } else if (type == "house") {
        await HouseImage.deleteOne({ _id: imageId });
      } else {
        res.status(404).json({ error: "Type must be area or house" });
      }
      res.status(200).json({ message: "Image Deleted" });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};

// ==================================

exports.viewAllFile = (type) => {
  return async (req, res, next) => {
    try {
      const { areaId, houseId } = req.body;
      let list = [];
      if (type == "area") {
        list = await AreaFile.find({ area_id: areaId });
      } else if (type == "house") {
        list = await HouseFile.find({ house_id: houseId });
      } else {
        res.status(404).json({ error: "Type must be area or house" });
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

      const { name, imageUrl, areaId, houseId, url, desc } = req.body;
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
        res.status(404).json({ error: "Type must be area or house" });
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

      const { name, url, imageUrl, desc } = req.body;
      const fileId = req.params.fileId;
      let check_file = null;
      if (type == "area") {
        check_file = await AreaFile.findById(fileId);
      } else if (type == "house") {
        check_file = await HouseFile.findById(fileId);
      } else {
        res.status(404).json({ error: "Type must be area or house" });
      }
      if (!check_file) {
        const err = new Error("File not exists");
        err.statusCode = 404;
        throw err;
      }

      check_file.name = name;
      check_file.url = url;
      check_file.imageUrl = imageUrl;
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
        await AreaFile.deleteOne({ _id: fileId });
      } else if (type == "house") {
        await HouseFile.deleteOne({ _id: fileId });
      } else {
        res.status(404).json({ error: "Type must be area or house" });
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
