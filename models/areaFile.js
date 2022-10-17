const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const areaFileSchema = new Schema(
  {
    area_id: {
      type: mongoose.Types.ObjectId,
      ref: "Area",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    imageUrl: String,
    name: {
      type: String,
      required: true,
    },
    desc: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Area_File", areaFileSchema);
