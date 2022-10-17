const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const houseImageSchema = new Schema(
  {
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: 'House_Category',
        required: true
    },
    house_id: {
        type: mongoose.Types.ObjectId,
        ref: 'House',
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

module.exports = mongoose.model("House_Image", houseImageSchema);
