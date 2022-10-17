const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const areaImageSchema = new Schema(
  {
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Area_Category',
        required: true
    },
    area_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Area',
        required: true
    },
    url: {
        type: String,
        required: true
    },
    desc: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Area_Image", areaImageSchema);
