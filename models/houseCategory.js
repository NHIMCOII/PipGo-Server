const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const houseCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("House_Category", houseCategorySchema);
