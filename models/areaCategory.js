const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const areaCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Area_Category", areaCategorySchema);
