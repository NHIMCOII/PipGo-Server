const fs = require("fs");
const path = require("path");
const config = require('config')
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const AreaImage = require("../models/areaImage");
const HouseImage = require("../models/houseImage");
const AreaCategory = require('../models/areaCategory')
const HouseCategory = require('../models/houseCategory')

exports.viewAllImage = (type) => {
  return async (req, res, next) => {
    try {
      const { areaId, houseId } = req.query;
      let list = [];
      if (type == "area") {
        list = await AreaImage.aggregate([
          {
            $match: {
              area_id: mongoose.Types.ObjectId(areaId),
            },
          },
          {
            $lookup: {
              from: "area_categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: { path: "$category" } },
          {
            $group: {
              _id: "$category.name",
              images: { $push: { _id: "$_id", url: "$url", desc: "$desc" } },
            },
          },
          {
            $project: {
              _id: 0,
              category: "$_id",
              images: "$images",
            },
          },
        ]);
      } else if (type == "house") {
        list = await HouseImage.aggregate([
          {
            $match: {
              house_id: mongoose.Types.ObjectId(houseId),
            },
          },
          {
            $lookup: {
              from: "house_categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: { path: "$category" } },
          {
            $group: {
              _id: "$category.name",
              images: { $push: { _id: "$_id", url: "$url", desc: "$desc" } },
            },
          },
          {
            $project: {
              _id: 0,
              category: "$_id",
              images: "$images",
            },
          },
        ]);
      } else {
        const err = new Error("Type must be area or house");
        err.statusCode = 400;
        throw err;
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

      const { categoryId, areaId, houseId, desc } = req.body;
      if (!req.file) {
        const error = new Error("No image provided");
        error.statusCode = 422;
        throw error;
      }
      const url = req.file.path.replace(/\\/g, "/");

      let result;
      if (type == "area") {
        const check_category = await AreaCategory.findById(categoryId)
        if(!check_category){
          const err = new Error("Category not exists")
          err.statusCode = 404
          throw err
        }
        result = new AreaImage({
          category_id: categoryId,
          area_id: areaId,
          url: url,
          desc: desc,
        });
      } else if (type == "house") {
        const check_category = await HouseCategory.findById(categoryId)
        if(!check_category){
          const err = new Error("Category not exists")
          err.statusCode = 404
          throw err
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

      const { categoryId, desc } = req.body;
      const imageId = req.params.imageId;
      
      let check_image = null;
      if (type == "area") {
        const check_category = await AreaCategory.findById(categoryId)
        if(!check_category){
          const err = new Error("Category not exists")
          err.statusCode = 404
          throw err
        }
        check_image = await AreaImage.findById(imageId);
      } else if (type == "house") {
        const check_category = await HouseCategory.findById(categoryId)
        if(!check_category){
          const err = new Error("Category not exists")
          err.statusCode = 404
          throw err
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
      if(req.file){
        clearImage(check_image.url)
        check_image.url = req.file.path.replace(/\\/g, "/");
      }
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
        const check_image = await AreaImage.findById(imageId)
        clearImage(check_image.url)
        await AreaImage.deleteOne({ _id: imageId });
      } else if (type == "house") {
        const check_image = await HouseImage.findById(imageId)
        clearImage(check_image.url)
        await HouseImage.deleteOne({ _id: imageId });  
      } else {
        const err = new Error("Type must be area or house");
        err.statusCode = 400;
        throw err;
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


const clearImage = (filePath) => {
  if(filePath != config.get("default.avatar")){
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
  }
  };
