const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const areaImageSchema = new Schema(
  {
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "Area_Category",
      required: true,
    },
    area_id: {
      type: mongoose.Types.ObjectId,
      ref: "Area",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    desc: String,
  },
  { timestamps: true }
);

areaImageSchema.statics.groupByCategory = function (areaId) {
  return this.aggregate([
    {
      $match: {
        area_id: mongoose.Types.ObjectId(areaId),
      },
    },
    {
      $lookup: {
        from: "area_categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category" } },
    {
      $group: {
        _id: "$category.name",
        images: { $push: { _id: "$_id", url: "$url", desc: "$desc" } },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        images: "$images",
      },
    },
  ]);
};

module.exports = mongoose.model("Area_Image", areaImageSchema);
