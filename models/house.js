const mongoose = require("mongoose");
const config = require ('config')

const Schema = mongoose.Schema;

const houseSchema = new Schema(
  {
    area_id: {
      type: mongoose.Types.ObjectId,
      ref: "Area",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["available", "maintaining", "fully booked"],
      default: config.get('booking_status.available')
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      default: config.get('default.avatar'),
    },
    desc: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("House", houseSchema);
