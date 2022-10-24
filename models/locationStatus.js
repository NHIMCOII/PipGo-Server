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

module.exports = mongoose.model("Location_Status", locationStatusSchema);
