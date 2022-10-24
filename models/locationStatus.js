const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const locationStatusSchema = new Schema(
  {
    province: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    status: {
      type: Number,
      required: true,
      default: 0
    }
  }
);

locationStatusSchema.statics.groupByProvince = function () {
  return this.aggregate([
    {
      $match: {
        status: { $gt: 0},
      },
    },
    {
      $group: {
        _id: "$province",
        district: {$push:{name: "$district"}}
      },
    },
    {
      $project: {
        _id: 0,
        province: '$_id',
        districts: "$district.name"
      }
    },
    {
      $sort: {province: 1}
    }
  ]).catch((err) => console.log(err));
};

module.exports = mongoose.model("Location_Status", locationStatusSchema);
