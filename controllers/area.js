const { validationResult } = require("express-validator");

const Area = require("../models/area");
const House = require("../models/house");
const Province = require('../models/province')
const District = require('../models/district')
const AreaImage = require("../models/areaImage");
const HouseImage = require("../models/houseImage");
const AreaFile = require("../models/areaFile");
const HouseFile = require("../models/houseFile");
const locationStatus_helper = require("../utils/locationStatus_helper");
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

    const {
      province,
      district,
      name,
      capacity,
      minPrice,
      maxPrice,
      avatar,
      desc,
    } = req.body;

    const check_province = await Province.findOne({name: province})
    const check_district = await District.findOne({name: district})
    if(!check_province || !check_district){
      const err = new Error('Not found province or district')
      err.statusCode = 404
      throw err
    }
    
    const check_area = await Area.findOne({
      name: name,
      province_id: check_province._id,
      district_id: check_district._id,
    });

    if (check_area) {
      const err = new Error(
        "This name is already taken, please pick a different one"
      );
      err.statusCode = 404;
      throw err;
    }

    const area = new Area({
      province_id: check_province._id,
      district_id: check_district._id,
      name: name,
      capacity: new Number(capacity),
      price: {
        min: minPrice,
        max: maxPrice,
      },
      avatar: avatar,
      desc: desc,
    });

    locationStatus_helper.add(province,district);
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
      province,
      district,
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
    const check_province = await Province.findOne({name: province})
    const check_district = await District.findOne({name: district})
    if(!check_province || !check_district){
      const err = new Error('Not found province or district')
      err.statusCode = 404
      throw err
    }

    if (!check_area) {
      const err = new Error("Area not found");
      err.statusCode = 404;
      throw err;
    }
    const check_name = await Area.findOne({
      name: name,
      province_id: check_province._id,
      district_id: check_district._id,
    });

    if (check_name && name != check_area.name) {
      const err = new Error(
        "This name is already taken, please pick a different one"
      );
      err.statusCode = 400;
      throw err;
    }

    locationStatus_helper.update(check_area.province_id,check_area.district_id, check_province._id,check_district._id);
    check_area.status = status;
    check_area.province_id = check_province._id;
    check_area.district_id = check_district._id;
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
    const check_house = await House.find({area_id: areaId})
    const check_area = await Area.findById(areaId);
    if(!check_area){
      const err = new Error('Area not found')
      err.statusCode = 404
      throw err
    }
    locationStatus_helper.delete(check_area)
    await Area.deleteOne({ _id: areaId });
    await House.deleteMany({ area_id: areaId });
    // Remember to delete house's files and images, do FE need url to delete images and files
    AreaFile.deleteMany({ area_id: areaId });
    AreaImage.deleteMany({ area_id: areaId });
    HouseFile.deleteMany({ house_id: check_house._id });
    HouseImage.deleteMany({ house_id: check_house._id });

    res.status(200).json({ message: "Area Deleted" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
