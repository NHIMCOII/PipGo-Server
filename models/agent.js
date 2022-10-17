const mongoose = require("mongoose");
// const config = require("config");

const Schema = mongoose.Schema;

const agentSchema = new Schema(
  {
    ref_id: {
      type: mongoose.Types.ObjectId,
      ref: "Agent",
    },
    contracts: [{ type: mongoose.Types.ObjectId, ref: "Contract" }],
    address: {
      province_id: { type: mongoose.Types.ObjectId, ref: "Province" },
      details: String,
    },
    area_id: {
      type: mongoose.Types.ObjectId,
      ref: "Area",
    },
    role: {
      type: String,
      required: true,
      enum: ["host", "sale_client"],
    },
    status: {
      type: Boolean,
      required: true,
      default: 1,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    avatar: {
      type: String,
      required: true,
      default: config.get("default.avatar"),
    },
    name: {
      first: {
        type: String,
        required: true,
      },
      last: {
        type: String,
        required: true,
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    refresh_token: String,
    resetToken: String,
    resetTokenExpiration: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", agentSchema);
