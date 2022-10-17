const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const houseFileSchema = new Schema(
  {
    house_id: {
      type: mongoose.Types.ObjectId,
      ref: "House",
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
    desc: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("House_File", houseFileSchema);
