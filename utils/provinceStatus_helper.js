const Province = require("../models/province");
const ProvinceStatus = require("../models/provinceStatus");

exports.add = async (provinceId) => {
  try {
    const province = await Province.findById(provinceId);
    const province_status = await ProvinceStatus.findOne({
      name: province.name,
      district: province.district,
    });
    if (!province_status) {
      const newStatus = new ProvinceStatus({
        name: province.name,
        district: province.district,
        status: 1,
      });
      return newStatus.save();
    }
    province_status.status++;
    return province_status.save();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    throw err;
  }
};

exports.update = async (oldProvinceId, newProvinceId) => {
  try {
    if (oldProvinceId.toString() == newProvinceId.toString()) {
      return;
    }
    const province_new = await Province.findById(newProvinceId)
    const province_old = await Province.findById(oldProvinceId)
    const newId = await ProvinceStatus.findOne({name: province_new.name,district: province_new.district});
    const oldId = await ProvinceStatus.findOne({name: province_old.name,district: province_old.district});
    if(!newId) {
      const newStatus = new ProvinceStatus({
        name: province_new.name,
        district: province_new.district,
        status: 1,
      });
      newStatus.save();
      oldId.status --
      oldId.save()
    }else {
      newId.status ++
      newId.save()
      oldId.status --
      oldId.save()
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    throw err;
  }
};
