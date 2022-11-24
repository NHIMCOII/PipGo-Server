const { validationResult } = require("express-validator");

const LocationStatus = require("../models/locationStatus");
const Area = require("../models/area");
const House = require("../models/house");
const config = require("config");

exports.filter = async (req, res, next) => {
  const { province, district, capacity } = req.query;
  let list = [];
  if (district && !province) {
    const err = new Error("You have to input province for given district");
    err.statusCode = 400;
    throw err;
  }
  if (province || district) {
    if (district) {
      if (capacity) {
        // province + district + capacity
        list = await Area.prov_dis_cap(province, district, capacity);
      } else {
        // province + district
        list = await Area.prov_dis(province, district);
      }
    } else {
      if (capacity) {
        // province + capacity
        list = await Area.prov_cap(province, capacity);
      } else {
        //province
        list = await Area.prov(province);
      }
    }
  } else {
    if (capacity) {
      // Capacity
      list = await Area.cap(capacity);
    } else {
      // No filter
      list = await Area.all();
    }
  }

  res.status(200).json({ message: "Filtered result", result: list });
};

exports.houseList = async (req, res, next) => {
  const { areaId } = req.query;
  const check_area = await Area.findById(areaId);
  if (!check_area) {
    const err = new Error("Area not found");
    err.statusCode = 404;
    throw err;
  }
  const list = await House.find({
    area_id: areaId,
    status: { $ne: config.get("booking_status.maintaining") },
  });
  res.status(200).json({ message: "Fetched Houses of Area", list: list });
};

exports.area = async (req, res, next) => {
  const areaId = req.params.areaId;
  const check_area = await Area.findById(areaId);
  if (!check_area) {
    const err = new Error("Area not found");
    err.statusCode = 404;
    throw err;
  }
  res.status(200).json({ message: "Fetched Area", area: check_area });
};

exports.house = async (req, res, next) => {
  const houseId = req.params.houseId;
  const check_house = await House.findById(houseId);
  if (!check_house) {
    const err = new Error("House not found");
    err.statusCode = 404;
    throw err;
  }
  res.status(200).json({ message: "Fetched House", house: check_house });
};

exports.location = async (req, res, next) => {
  const list = await LocationStatus.groupByProvince();
  res.status(200).json({ message: "Fetched Province", list: list });
};
