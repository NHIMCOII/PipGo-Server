const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const provinceSchema = new Schema({
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
  phone_code: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Province", provinceSchema);
