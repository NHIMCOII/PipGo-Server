const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const config = require("config");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require("../models/user");
const AreaCategory = require("../models/areaCategory");
const HouseCategory = require("../models/houseCategory");

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { role, email, phone, firstName, lastName, gender, dob } = req.body;
    if(!role){
      throw new Error('Role is required')
    }

    const check_user = await User.findOne({
      email: email,
      role: role,
    });
    if (check_user) {
      throw new Error(
        "This account is already in use, please pick a different one."
      );
    }

    const salt = await bcrypt.genSalt();
    const hash_password = await bcrypt.hash(
      config.get("default.password"),
      salt
    );

    const user = new User({
      role: role,
      email: email,
      phone: phone,
      password: hash_password,
      name: {
        first: firstName,
        last: lastName,
      },
      gender: gender,
      dob: new Date(dob),
    });

    await user.save();
    res.status(201).json({ message: "New User Created", user: user });
    sgMail.send({
      to: email,
      from: process.env.SENDGRID_EMAIL,
      subject: "Registered",
      html: `
      <h1>Login PipGo with your email and default password</h1>
      <p>Email: ${email}</p>
      <p>Password: ${config.get("default.password")}</p>
      <p>Your role: ${role}</p>
      `,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

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
    const { provinceId,addressDetails,email, phone, firstName, lastName, gender, dob, avatar } = req.body;
    const userId = req.params.userId;
    const check_user = await User.findById(userId);
    const check_email = await User.findOne({email: email,role: check_user.role})

    if(check_email && email != check_user.email){
      const err = new Error('This email has already been used, please pick a different one')
      err.statusCode = 400
      throw err
    }
    if (!check_user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    check_user.email = email;
    check_user.phone = phone;
    check_user.name.first = firstName;
    check_user.name.last = lastName;
    check_user.gender = gender;
    check_user.dob = dob;
    check_user.avatar = avatar;
    check_user.address.province_id = provinceId
    check_user.address.details = addressDetails

    await check_user.save();
    res.status(200).json({ message: "User Updated", user: check_user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.userId;
    const check_user = await User.findById(userId);
    if (!check_user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const isEqual = await bcrypt.compare(oldPassword, check_user.password);
    if (!isEqual) {
      const error = new Error("Your old password is incorrect");
      error.statusCode = 401;
      throw error;
    }
    const salt = await bcrypt.genSalt();
    const hash_password = await bcrypt.hash(newPassword, salt);
    check_user.password = hash_password;
    await check_user.save();
    sgMail.send({
      to: check_user.email,
      from: process.env.SENDGRID_EMAIL,
      subject: "Update Password Successfully",
      html: `
      <h1>Password Updated</h1>
      <p>Email: ${check_user.email}</p>
      <p>Password: ${newPassword}</p>
      <p>Your role: ${check_user.role}</p>
      `,
    });
    res.status(200).json({ message: "Password updated successfully" });
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
    res.status(200).json({ message: "User Deleted" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
 
// ================================== Category ======================================
exports.viewCategory = (type) => {
  return async (req, res, next) => {
    try {
      let list = [];
      if (type == "area") {
        list = await AreaCategory.find();
      } else if (type == "house") {
        list = await HouseCategory.find();
      } else {
        res.status(404).json({ error: "Must be area or house category" });
      }

      res
        .status(200)
        .json({ message: "Fetched all category", areaCategory: list });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};

exports.addCategory = (type) => {
  return async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const { name } = req.body;
      let category;
      if (type == "area") {
        const check_area = await AreaCategory.findOne({ name: name });
        if (check_area) {
          throw new Error("This category is already exists");
        }
        category = new AreaCategory({ name: name });
      } else if (type == "house") {
        const check_house = await HouseCategory.findOne({ name: name });
        if (check_house) {
          throw new Error("This category is already exists");
        }
        category = new HouseCategory({ name: name });
      } else {
        res.status(404).json({ error: "Category must be area or house" });
      }

      await category.save();
      res
        .status(201)
        .json({ message: "New category created", category: category });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};

exports.updateCategory = (type) => {
  return async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const { name } = req.body;
      const categoryId = req.params.categoryId
      let result
      if (type == "area") {
        const check_area = await AreaCategory.findById(categoryId);
        if (!check_area) {
          throw new Error("This category dont exist");
        }
        check_area.name = name
        result = await check_area.save()
      } else if (type == "house") {
        const check_house = await HouseCategory.findById(categoryId);
        if (!check_house) {
          throw new Error("This category dont exist");
        }
        check_house.name = name
        result = await check_house.save()
      } else {
        res.status(404).json({ error: "Category must be area or house" });
      }

      res
        .status(201)
        .json({ message: "Updated category successfully", category: result });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};

exports.deleteCategory = (type) => {
  return async (req, res, next) => {
    try {
      const categoryId = req.params.categoryId
      let result
      if (type == "area") {
        const check_area = await AreaCategory.findById(categoryId);
        if (!check_area) {
          throw new Error("This category dont exist");
        }
        await AreaCategory.deleteOne({ _id: categoryId })
      } else if (type == "house") {
        const check_house = await HouseCategory.findById(categoryId);
        if (!check_house) {
          throw new Error("This category dont exist");
        }
        await HouseCategory.deleteOne({ _id: categoryId })
      } else {
        res.status(404).json({ error: "Category must be area or house" });
      }

      res
        .status(201)
        .json({ message: "Deleted category successfully"});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};
