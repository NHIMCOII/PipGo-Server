const { validationResult } = require("express-validator");

const House = require("../models/house");
const HouseFile = require('../models/houseFile')
const HouseImage = require('../models/houseImage')

exports.houseList = async (req,res,next) => {
  try {
    const {areaId} = req.body 
    const list = await House.find({area_id: areaId})
    res.status(200).json({message: 'Fetched all houses', list: list})
  }catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.addHouse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { areaId, name, quantity, price } = req.body;

    const check_house = await House.findOne({
      name: name,
      area_id: areaId,
    });

    if (check_house) {
      const err = new Error(
        "This name is already taken, please pick a different one or increase the quantity of the given house"
      );
      err.statusCode = 400
      throw err
    }

    const house = new House({
      area_id: areaId,
      name: name,
      quantity: new Number(quantity),
      price: price
    });

    await house.save();
    res.status(201).json({ message: "New House Created", house: house });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateHouse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { areaId, status, name, quantity, price, avatar, desc} = req.body;
    const houseId = req.params.houseId;
    const check_house = await House.findById(houseId);

    if(!check_house) {
      const err = new Error('House not found')
      err.statusCode = 404
      throw err
    }
    const check_name = await House.findOne({
      name: name,
      area_id: areaId,
    });

    if (check_name && name != check_house.name) {
      const err = new Error(
        "This name is already taken, please pick a different one or increase the quantity of the given house"
      );
      err.statusCode = 400
      throw err
    }

    check_house.status = status;
    check_house.name = name;
    check_house.quantity = quantity;
    check_house.price = price;
    check_house.avatar = avatar
    check_house.desc = desc

    await check_house.save();
    res
      .status(201)
      .json({ message: "Updated Area Successfully", area: check_house });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteHouse = async (req, res, next) => {
  try {
    const houseId = req.params.houseId;
    await House.deleteOne({ _id: houseId });
    // HouseFile.deleteMany({area_id: houseId})
    // HouseImage.deleteMany({area_id: houseId})
    res.status(200).json({ message: "House Deleted" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
