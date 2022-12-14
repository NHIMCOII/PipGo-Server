const House = require("../models/house");
const HouseFile = require("../models/houseFile");
const HouseImage = require("../models/houseImage");

const { clearFile } = require("../utils/helper");

exports.houseList = async (req, res, next) => {
  const { areaId } = req.query;
  const list = await House.find({ area_id: areaId });
  res.status(200).json({ message: "Fetched all houses", list: list });
};

exports.addHouse = async (req, res, next) => {
  const { areaId, name, quantity, price, desc } = req.body;
  let avatar;
  if (req.file) {
    avatar = req.file.path.replace(/\\/g, "/");
  }

  const check_house = await House.findOne({
    name: name,
    area_id: areaId,
  });

  if (check_house) {
    const err = new Error(
      "This name is already taken, please pick a different one or increase the quantity of the given house"
    );
    err.statusCode = 400;
    throw err;
  }

  const house = new House({
    area_id: areaId,
    name: name,
    quantity: new Number(quantity),
    price: price,
    avatar: avatar,
    desc: desc,
  });

  await house.save();
  res.status(201).json({ message: "New House Created", house: house });
};

exports.updateHouse = async (req, res, next) => {
  const { areaId, status, name, quantity, price, desc } = req.body;
  const houseId = req.params.houseId;
  const check_house = await House.findById(houseId);

  if (!check_house) {
    const err = new Error("House not found");
    err.statusCode = 404;
    throw err;
  }
  const check_name = await House.findOne({
    name: name,
    area_id: areaId,
  });

  if (check_name && name != check_house.name) {
    const err = new Error(
      "This name is already taken, please pick a different one or increase the quantity of the given house"
    );
    err.statusCode = 400;
    throw err;
  }

  check_house.status = status;
  check_house.name = name;
  check_house.quantity = quantity;
  check_house.price = price;
  if (req.file) {
    clearFile(check_house.avatar);
    check_house.avatar = req.file.path.replace(/\\/g, "/");
  }
  check_house.desc = desc;

  await check_house.save();
  res
    .status(201)
    .json({ message: "Updated Area Successfully", house: check_house });
};

exports.deleteHouse = async (req, res, next) => {
  const houseId = req.params.houseId;
  const check_house = await House.findById(houseId);
  clearFile(check_house.avatar);
  await House.deleteOne({ _id: houseId });

  const files = await HouseFile.find({ house_id: houseId });
  files.map((file) => {
    clearFile(file.url);
    clearFile(file.imageUrl);
  });
  HouseFile.deleteMany({ house_id: houseId });

  const images = await HouseImage.find({ house_id: houseId });
  images.map((image) => {
    clearFile(image.url);
  });
  HouseImage.deleteMany({ house_id: houseId });

  res.status(200).json({ message: "House Deleted" });
};
