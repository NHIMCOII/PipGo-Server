const { body } = require("express-validator");
// const config = require("config");

const User = require("../models/user");

exports.userInfo = [
  body("role")
    .exists({ checkFalsy: true })
    .withMessage("Role is required")
    .bail(),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email")
    .bail()
    .normalizeEmail(),
  body("phone")
    .exists()
    .withMessage("Phone number is required")
    .bail()
    .trim()
    .isMobilePhone()
    .bail(),
  body("firstName")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Firstname is required")
    .bail()
    .isAlpha("vi-VN", { ignore: " " })
    .bail(),
  body("lastName")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Lastname is required")
    .bail()
    .isAlpha("vi-VN", { ignore: " " })
    .bail(),
  body("gender").exists().withMessage("Gender is required").bail(),
  body("dob").exists().withMessage("Date of birth is required"),
];

exports.login = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email")
    .bail()
    .normalizeEmail(),
  body(
    "password",
    "Please enter a password at least 8 characters long without special characters"
  )
    .trim()
    .isLength({ min: 8 })
    .bail()
    .isAlphanumeric()
    .bail(),
  body("role")
    .exists({ checkFalsy: true })
    .withMessage("Role is required")
    .bail(),
];

exports.reset = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email")
    .bail()
    .normalizeEmail(),
  body("role")
    .exists({ checkFalsy: true })
    .withMessage("Role is required")
    .bail(),
];

exports.newPassword = [
  body(
    "newPassword",
    "Please enter a password at least 8 characters long without special characters"
  )
    .trim()
    .isLength({ min: 8 })
    .isAlphanumeric(),

  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords have to match");
      }
      return true;
    })
    .bail(),
];
