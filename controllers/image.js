const AreaImage = require("../models/areaImage");
const HouseImage = require("../models/houseImage");
const AreaCategory = require("../models/areaCategory");
const HouseCategory = require("../models/houseCategory");

const { clearFile } = require("../utils/helper");

exports.viewAllImage = (type) => {
  return async (req, res, next) => {
    const { areaId, houseId } = req.query;
    let list = [];
    if (type == "area") {
      list = await AreaImage.groupByCategory(areaId);
    } else if (type == "house") {
      list = await HouseImage.groupByCategory(houseId);
    } else {
      const err = new Error("Type must be area or house");
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ message: "Fetched all area images", images: list });
  };
};

exports.uploadImage = (type) => {
  return async (req, res, next) => {
    const { categoryId, areaId, houseId, desc } = req.body;
    if (!req.file) {
      const error = new Error("No image provided");
      error.statusCode = 422;
      throw error;
    }
    const url = req.file.path.replace(/\\/g, "/");

    let result;
    if (type == "area") {
      const check_category = await AreaCategory.findById(categoryId);
      if (!check_category) {
        const err = new Error("Category not exists");
        err.statusCode = 404;
        throw err;
      }
      result = new AreaImage({
        category_id: categoryId,
        area_id: areaId,
        url: url,
        desc: desc,
      });
    } else if (type == "house") {
      const check_category = await HouseCategory.findById(categoryId);
      if (!check_category) {
        const err = new Error("Category not exists");
        err.statusCode = 404;
        throw err;
      }
      result = new HouseImage({
        category_id: categoryId,
        house_id: houseId,
        url: url,
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
      .json({ message: "Upload image successfully", image: result });
  };
};

exports.editImage = (type) => {
  return async (req, res, next) => {
    const { categoryId, desc } = req.body;
    const imageId = req.params.imageId;

    let check_image = null;
    if (type == "area") {
      const check_category = await AreaCategory.findById(categoryId);
      if (!check_category) {
        const err = new Error("Category not exists");
        err.statusCode = 404;
        throw err;
      }
      check_image = await AreaImage.findById(imageId);
    } else if (type == "house") {
      const check_category = await HouseCategory.findById(categoryId);
      if (!check_category) {
        const err = new Error("Category not exists");
        err.statusCode = 404;
        throw err;
      }
      check_image = await HouseImage.findById(imageId);
    } else {
      const err = new Error("Type must be area or house");
      err.statusCode = 400;
      throw err;
    }
    if (!check_image) {
      const err = new Error("Image not exists");
      err.statusCode = 404;
      throw err;
    }

    check_image.category_id = categoryId;
    if (req.file) {
      clearFile(check_image.url);
      check_image.url = req.file.path.replace(/\\/g, "/");
    }
    check_image.desc = desc;
    await check_image.save();
    res
      .status(201)
      .json({ message: "Edited image successfully", image: check_image });
  };
};

exports.deleteImage = (type) => {
  return async (req, res, next) => {
    const imageId = req.params.imageId;
    if (type == "area") {
      const check_image = await AreaImage.findById(imageId);
      clearFile(check_image.url);
      await AreaImage.deleteOne({ _id: imageId });
    } else if (type == "house") {
      const check_image = await HouseImage.findById(imageId);
      clearFile(check_image.url);
      await HouseImage.deleteOne({ _id: imageId });
    } else {
      const err = new Error("Type must be area or house");
      err.statusCode = 400;
      throw err;
    }
    res.status(200).json({ message: "Image Deleted" });
  };
};
