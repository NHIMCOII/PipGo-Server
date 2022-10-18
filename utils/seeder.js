const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const config = require("config");

const User = require("../models/user");
const Province = require("../models/province");

exports.adminInit = async () => {
  try {
    mongoose.connect(process.env.DATABASE || "mongodb://127.0.0.1:27017/Pipgo");
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(config.get("default.password"), salt);
    await User.deleteOne({role: "admin"})
    let admin = await User.create({
      role: "admin",
      email: "admin@gmail.com",
      phone: "0912345678",
      password: hash,
      name: {
        first: "ad",
        last: "min",
      },
      gender: "other",
      dob: "01/01/3000",
    });

    if (admin) console.log("Init admin successfully!!!");

    mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
};

exports.provinceInit = async () => {
  try {
    mongoose.connect(process.env.DATABASE || "mongodb://127.0.0.1:27017/Pipgo");
    await Province.deleteMany();
    console.log("Deleted all province!!!");

    const data = [
      {
        name: "Hà Nội",
        district: "Long Biên",
      },
      {
        name: "Hà Nội",
        district: "Hai Bà Trưng",
      },
      {
        name: "Hải Phòng",
        district: "Hồng Bàng",
      },
    ];

    for (let i = 0; i < data.length; i++) {
      await Province.create({
        name: data[i].name,
        district: data[i].district,
      });
    }

    console.log("Province is Seeded");

    mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
};
