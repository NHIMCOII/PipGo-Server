const { validationResult } = require("express-validator");

const AreaCategory = require("../models/areaCategory");
const HouseCategory = require("../models/houseCategory");

exports.viewCategory = (type) => {
    return async (req, res, next) => {
      try {
        let list = [];
        if (type == "area") {
          list = await AreaCategory.find();
        } else if (type == "house") {
          list = await HouseCategory.find();
        } else {
          res.status(404).json({ error: "Must be area or house category" });
        }
  
        res
          .status(200)
          .json({ message: "Fetched all category", areaCategory: list });
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    };
  };
  
  exports.addCategory = (type) => {
    return async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const error = new Error("Validation failed.");
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
        }
  
        const { name } = req.body;
        let category;
        if (type == "area") {
          const check_area = await AreaCategory.findOne({ name: name });
          if (check_area) {
            throw new Error("This category is already exists");
          }
          category = new AreaCategory({ name: name });
        } else if (type == "house") {
          const check_house = await HouseCategory.findOne({ name: name });
          if (check_house) {
            throw new Error("This category is already exists");
          }
          category = new HouseCategory({ name: name });
        } else {
          res.status(404).json({ error: "Category must be area or house" });
        }
  
        await category.save();
        res
          .status(201)
          .json({ message: "New category created", category: category });
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    };
  };
  
  exports.updateCategory = (type) => {
    return async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const error = new Error("Validation failed.");
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
        }
  
        const { name } = req.body;
        const categoryId = req.params.categoryId
        let result
        if (type == "area") {
          const check_area = await AreaCategory.findById(categoryId);
          if (!check_area) {
            throw new Error("This category dont exist");
          }
          check_area.name = name
          result = await check_area.save()
        } else if (type == "house") {
          const check_house = await HouseCategory.findById(categoryId);
          if (!check_house) {
            throw new Error("This category dont exist");
          }
          check_house.name = name
          result = await check_house.save()
        } else {
          res.status(404).json({ error: "Category must be area or house" });
        }
  
        res
          .status(201)
          .json({ message: "Updated category successfully", category: result });
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    };
  };
  
  exports.deleteCategory = (type) => {
    return async (req, res, next) => {
      try {
        const categoryId = req.params.categoryId
        let result
        if (type == "area") {
          const check_area = await AreaCategory.findById(categoryId);
          if (!check_area) {
            throw new Error("This category dont exist");
          }
          await AreaCategory.deleteOne({ _id: categoryId })
        } else if (type == "house") {
          const check_house = await HouseCategory.findById(categoryId);
          if (!check_house) {
            throw new Error("This category dont exist");
          }
          await HouseCategory.deleteOne({ _id: categoryId })
        } else {
          res.status(404).json({ error: "Category must be area or house" });
        }
  
        res
          .status(201)
          .json({ message: "Deleted category successfully"});
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    };
  };
  