const mongoose = require("mongoose");
const config = require("config");

const Schema = mongoose.Schema;

const areaSchema = new Schema(
  {
    province_id: {
      type: mongoose.Types.ObjectId,
      ref: "Province",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["available", "maintaining", "fully booked"],
      default: config.get("booking_status.maintaining"),
    },
    name: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    price: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    avatar: {
      type: String,
      required: false,
      default: config.get("default.avatar"),
    },
    video: String,
    desc: String,
  },
  { timestamps: true }
);

// ============================= Filter ================================
areaSchema.statics.prov_dis_cap = function (province, district, capacity) {
  capacity = Number(capacity);
  return this.aggregate([
    {
      $lookup: {
        from: "provinces",
        localField: "province_id",
        foreignField: "_id",
        as: "province",
      },
    },
    { $unwind: { path: "$province" } },
    {
      $project: {
        province_id: 0,
        created_at: 0,
        updated_at: 0,
        "province._id": 0,
      },
    },
    {
      $match: {
        status: { $ne: config.get("booking_status.maintaining") },
        "province.name": province,
        "province.district": district,
        capacity: { $gte: capacity },
      },
    },
  ]).catch((err) => console.log(err));
};

areaSchema.statics.prov_dis = function (province, district) {
  return this.aggregate([
    {
      $lookup: {
        from: "provinces",
        localField: "province_id",
        foreignField: "_id",
        as: "province",
      },
    },
    { $unwind: { path: "$province" } },
    {
      $project: {
        province_id: 0,
        created_at: 0,
        updated_at: 0,
        "province._id": 0,
      },
    },
    {
      $match: {
        status: { $ne: config.get("booking_status.maintaining") },
        "province.name": province,
        "province.district": district,
      },
    },
  ]).catch((err) => console.log(err));
};

areaSchema.statics.prov_cap = function (province, capacity) {
  capacity = Number(capacity);
  return this.aggregate([
    {
      $lookup: {
        from: "provinces",
        localField: "province_id",
        foreignField: "_id",
        as: "province",
      },
    },
    { $unwind: { path: "$province" } },
    {
      $project: {
        province_id: 0,
        created_at: 0,
        updated_at: 0,
        "province._id": 0,
      },
    },
    {
      $match: {
        status: { $ne: config.get("booking_status.maintaining") },
        "province.name": province,
        capacity: { $gte: capacity },
      },
    },
  ]).catch((err) => console.log(err));
};

areaSchema.statics.prov = function (province) {
  return this.aggregate([
    {
      $lookup: {
        from: "provinces",
        localField: "province_id",
        foreignField: "_id",
        as: "province",
      },
    },
    { $unwind: { path: "$province" } },
    {
      $project: {
        province_id: 0,
        created_at: 0,
        updated_at: 0,
        "province._id": 0,
      },
    },
    {
      $match: {
        status: { $ne: config.get("booking_status.maintaining") },
        "province.name": province,
      },
    },
  ]).catch((err) => console.log(err));
};

areaSchema.statics.cap = function (capacity) {
  capacity = Number(capacity);
  return this.aggregate([
    {
      $lookup: {
        from: "provinces",
        localField: "province_id",
        foreignField: "_id",
        as: "province",
      },
    },
    { $unwind: { path: "$province" } },
    {
      $project: {
        province_id: 0,
        created_at: 0,
        updated_at: 0,
        "province._id": 0,
      },
    },
    {
      $match: {
        status: { $ne: config.get("booking_status.maintaining") },
        capacity: { $gte: capacity },
      },
    },
  ]).catch((err) => console.log(err));
};

module.exports = mongoose.model("Area", areaSchema);
