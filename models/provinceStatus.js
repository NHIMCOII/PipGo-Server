const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const provinceStatusSchema = new Schema(
  {
    name: {
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

module.exports = mongoose.model("Province_Status", provinceStatusSchema);
