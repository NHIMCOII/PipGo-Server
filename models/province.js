const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const provinceSchema = new Schema(
  {
    name: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
  }
);

module.exports = mongoose.model("Province", provinceSchema);
