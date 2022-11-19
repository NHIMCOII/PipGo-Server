const fs = require("fs");
const path = require("path");
const config = require("config");

const Province = require("../models/province");
const District = require("../models/district");
const LocationStatus = require("../models/locationStatus");

exports.locationStatusAdd = async (province, district) => {
  try {
    const location_status = await LocationStatus.findOne({
      province: province,
      district: district,
    });
    if (!location_status) {
      const newStatus = new LocationStatus({
        province: province,
        district: district,
        status: 1,
      });
      return newStatus.save();
    }
    location_status.status++;
    return location_status.save();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    throw err;
  }
};

exports.locationStatusUpdate = async (
  oldProvinceId,
  oldDistrictId,
  newProvinceId,
  newDistrictId
) => {
  try {
    if (
      oldProvinceId.toString() == newProvinceId.toString() &&
      oldDistrictId.toString() == newDistrictId.toString()
    ) {
      return;
    }
    const province_new = await Province.findById(newProvinceId);
    const province_old = await Province.findById(oldProvinceId);
    const district_new = await District.findById(newDistrictId);
    const district_old = await District.findById(oldDistrictId);
    const newId = await LocationStatus.findOne({
      province: province_new.name,
      district: district_new.name,
    });
    const oldId = await LocationStatus.findOne({
      province: province_old.name,
      district: district_old.name,
    });
    if (!newId) {
      const newStatus = new LocationStatus({
        province: province_new.name,
        district: district_new.name,
        status: 1,
      });
      newStatus.save();
      oldId.status--;
      oldId.save();
    } else {
      newId.status++;
      newId.save();
      oldId.status--;
      oldId.save();
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    throw err;
  }
};

exports.locationStatusDelete = async (check_area) => {
  try {
    const check_province = await Province.findById(check_area.province_id);
    const check_district = await District.findById(check_area.district_id);
    const check_loactionStatus = await LocationStatus.findOne({
      province: check_province.name,
      district: check_district.name,
    });
    check_loactionStatus.status--;
    check_loactionStatus.save();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    throw err;
  }
};

exports.clearFile = (filePath) => {
  if (filePath != config.get("default.avatar")) {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
};