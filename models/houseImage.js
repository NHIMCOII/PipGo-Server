const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const houseImageSchema = new Schema(
  {
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "House_Category",
      required: true,
    },
    house_id: {
      type: mongoose.Types.ObjectId,
      ref: "House",
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

houseImageSchema.statics.groupByCategory = function (houseId) {
  return this.aggregate([
    {
      $match: {
        house_id: mongoose.Types.ObjectId(houseId),
      },
    },
    {
      $lookup: {
        from: "house_categories",
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

module.exports = mongoose.model("House_Image", houseImageSchema);
