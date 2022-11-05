const mongoose = require("mongoose");
const config = require("config");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // contracts: [{ type: mongoose.Types.ObjectId, ref: "Contract" }],
    // address: {
    //   province_id: { type: mongoose.Types.ObjectId, ref: "Province" },
    //   details: String,
    // },
    role: {
      type: String,
      required: true,
      enum: ["admin", "editor", "sale_user"],
    },
    status: {
      type: Boolean,
      required: true,
      default: 1,
    },
    contact: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
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

module.exports = mongoose.model("User", userSchema);
