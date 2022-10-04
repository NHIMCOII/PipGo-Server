const { validationResult } = require("express-validator");
const config = require("config");

const User = require("../models/user");

exports.profile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const check_user = await User.findById(userId);
    if (!check_user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "User fetched", user: check_user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const {
      role,
      email,
      phone,
      firstName,
      lastName,
      gender,
      dob,
      status,
      avatar,
    } = req.body;

    const userId = req.params.userId;
    const check_user = await User.findById(userId);
    if (!check_user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    check_user.role = role;
    check_user.email = email;
    check_user.phone = phone;
    check_user.name.first = firstName;
    check_user.name.last = lastName;
    check_user.gender = gender;
    check_user.dob = dob;
    check_user.status = status;
    check_user.avatar = avatar;

    await check_user.save();
    res.status(200).json({ message: "User Updated", user: check_user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.userList = async (req, res, next) => {
  try {
    const list = await User.find();
    res.status(200).json({ message: "Fetched all users", list: list });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.deleteOne({ _id: userId });
    res.status(200).json({ message: "User Deleted"});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
