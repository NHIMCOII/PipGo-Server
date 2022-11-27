const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const districtSchema = new Schema({
  code: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  division_type: {
    type: String,
    required: true,
  },
  codename: {
    type: String,
    required: true,
  },
  province_code: {
    type: Number,
    required: true,
    ref: "Province",
  },
});

module.exports = mongoose.model("District", districtSchema);
