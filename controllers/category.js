const AreaCategory = require("../models/areaCategory");
const HouseCategory = require("../models/houseCategory");

exports.viewCategory = (type) => {
  return async (req, res, next) => {
    let list = [];
    if (type == "area") {
      list = await AreaCategory.find();
    } else if (type == "house") {
      list = await HouseCategory.find();
    } else {
      const err = new Error("Category must be area or house");
      err.statusCode = 400;
      throw err;
    }

    res
      .status(200)
      .json({ message: "Fetched all category", areaCategory: list });
  };
};

exports.addCategory = (type) => {
  return async (req, res, next) => {
    const { name } = req.body;
    let category;
    if (type == "area") {
      const check_area = await AreaCategory.findOne({ name: name });
      if (check_area) {
        const err = new Error("This category is already exists");
        err.statusCode = 400;
        throw err;
      }
      category = new AreaCategory({ name: name });
    } else if (type == "house") {
      const check_house = await HouseCategory.findOne({ name: name });
      if (check_house) {
        const err = new Error("This category is already exists");
        err.statusCode = 400;
        throw err;
      }
      category = new HouseCategory({ name: name });
    } else {
      const err = new Error("Category must be area or house");
      err.statusCode = 400;
      throw err;
    }

    await category.save();
    res
      .status(201)
      .json({ message: "New category created", category: category });
  };
};

exports.updateCategory = (type) => {
  return async (req, res, next) => {
    const { name } = req.body;
    const categoryId = req.params.categoryId;
    let result;
    if (type == "area") {
      const check_area = await AreaCategory.findById(categoryId);
      if (!check_area) {
        const err = new Error("This category doesnt exist");
        err.statusCode = 404;
        throw err;
      }
      const check_name = await AreaCategory.findOne({ name: name });
      if (check_name && name != check_area.name) {
        const err = new Error("This category is already exists");
        err.statusCode = 400;
        throw err;
      }
      check_area.name = name;
      result = await check_area.save();
    } else if (type == "house") {
      const check_house = await HouseCategory.findById(categoryId);
      if (!check_house) {
        const err = new Error("This category doesnt exist");
        err.statusCode = 404;
        throw err;
      }
      const check_name = await HouseCategory.findOne({ name: name });
      if (check_name && name != check_house.name) {
        const err = new Error("This category is already exists");
        err.statusCode = 400;
        throw err;
      }
      check_house.name = name;
      result = await check_house.save();
    } else {
      const err = new Error("Category must be area or house");
      err.statusCode = 400;
      throw err;
    }

    res
      .status(201)
      .json({ message: "Updated category successfully", category: result });
  };
};

exports.deleteCategory = (type) => {
  return async (req, res, next) => {
    const categoryId = req.params.categoryId;
    let result;
    if (type == "area") {
      const check_area = await AreaCategory.findById(categoryId);
      if (!check_area) {
        const err = new Error("This category doesnt exist");
        err.statusCode = 404;
        throw err;
      }
      await AreaCategory.deleteOne({ _id: categoryId });
    } else if (type == "house") {
      const check_house = await HouseCategory.findById(categoryId);
      if (!check_house) {
        const err = new Error("This category doesnt exist");
        err.statusCode = 404;
        throw err;
      }
      await HouseCategory.deleteOne({ _id: categoryId });
    } else {
      const err = new Error("Category must be area or house");
      err.statusCode = 400;
      throw err;
    }

    res.status(201).json({ message: "Deleted category successfully" });
  };
};
