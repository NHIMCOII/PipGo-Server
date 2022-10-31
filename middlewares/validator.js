const { body, query } = require("express-validator");
const config = require("config");
const Area = require("../models/area");

exports.profile = [
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
    .withMessage("First name must not contain special character")
    .bail(),
  body("lastName")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Lastname is required")
    .bail()
    .isAlpha("vi-VN", { ignore: " " })
    .withMessage("Last name must not contain special character")
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
    .withMessage("Password must not contain special character")
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

exports.resetPassword = [
  body(
    "newPassword",
    "Please enter a password at least 8 characters long without special characters"
  )
    .trim()
    .isLength({ min: 8 })
    .isAlphanumeric()
    .withMessage("Password must not contain special character"),
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

exports.updatePassword = [
  body(
    "oldPassword",
    "Please enter a password at least 8 characters long without special characters"
  )
    .trim()
    .isLength({ min: 8 })
    .isAlphanumeric()
    .withMessage("Password must not contain special character"),
  body(
    "newPassword",
    "Please enter a password at least 8 characters long without special characters"
  )
    .trim()
    .isLength({ min: 8 })
    .isAlphanumeric()
    .withMessage("Password must not contain special character"),
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

exports.category = [
  body("name")
    .exists()
    .withMessage("Category name is required")
    .bail()
    .trim()
    .isAlphanumeric("vi-VN", { ignore: " -,." })
    .withMessage("Category name must not contain special character"),
];

exports.area = [
  body("province").exists().withMessage("Province is required").bail(),
  body("district").exists().withMessage("District is required").bail(),
  body("name")
    .exists()
    .withMessage("Area name is required")
    .bail()
    .trim()
    .isAlphanumeric("vi-VN", { ignore: " -,." })
    .withMessage("Area name must not contain special character"),
  body("capacity")
    .exists()
    .withMessage("Capacity is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Capacity must be an integer greater than 0")
    .bail(),
  body("minPrice")
    .exists()
    .withMessage("Minimum price is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Minimum price must be an integer greater than 0")
    .bail(),
  body("maxPrice")
    .exists()
    .withMessage("Maximum price is required")
    .bail()
    .isInt({ min: 1 })
    .custom((value, { req }) => {
      if (Number(value) <= Number(req.body.minPrice)) {
        throw new Error("Max price must greater than min price");
      }
      return true;
    })
    .withMessage("Maximum price must be an integer greater than min price")
    .bail(),
  body("desc")
    .isAlphanumeric("vi-VN", { ignore: " -,." })
    .withMessage("Area description must not contain special character")
    .isLength({ max: config.get("desc_length") })
    .withMessage(
      `Description cant be over ${config.get("desc_length")} characters`
    )
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
];

exports.house = [
  body("areaId")
    .exists()
    .withMessage("Area is required")
    .bail()
    .custom(async (value, { req }) => {
      try {
        const check_area = await Area.findById(value);
        if (!check_area) {
          const err = new Error("Area not found");
          err.statusCode = 404;
          throw err;
        }
        return true;
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    })
    .withMessage("Area invalid")
    .bail(),
  body("name")
    .exists()
    .withMessage("House name is required")
    .bail()
    .trim()
    .isAlphanumeric("vi-VN", { ignore: " -,." })
    .withMessage("House name must not contain special character"),
  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Quantity must be an integer greater than 0")
    .bail(),
  body("price")
    .exists()
    .withMessage("Price is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Price must be an integer greater than 0")
    .bail(),
  body("desc")
    .isAlphanumeric("vi-VN", { ignore: " -,." })
    .withMessage("House description must not contain special character")
    .isLength({ max: config.get("desc_length") })
    .withMessage(
      `Description cant be over ${config.get("desc_length")} characters`
    )
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
];

exports.image = [
  body("categoryId").exists().withMessage("Category is required").bail(),
  body("desc")
    .isAlphanumeric("vi-VN", { ignore: " -,." })
    .withMessage("Image description must not contain special character")
    .isLength({ max: config.get("desc_length") })
    .withMessage(
      `Description cant be over ${config.get("desc_length")} characters`
    )
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
];

exports.file = [
  body("name")
    .exists()
    .withMessage("File name is required")
    .bail()
    .isAlphanumeric("vi-VN", { ignore: " -," })
    .withMessage("File name must not contain special character")
    .bail()
    .trim()
    .isLength({ max: config.get("name_length") })
    .withMessage(
      `File name cant be over ${config.get("name_length")} characters`
    ),
  body("desc")
    .isAlphanumeric("vi-VN", { ignore: " -,." })
    .withMessage("File description must not contain special character")
    .isLength({ max: config.get("desc_length") })
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
];

exports.filter = [
  query("province")
    .isAlphanumeric("vi-VN", { ignore: " -," })
    .withMessage("Province name must not contain special character")
    .bail()
    .trim()
    .optional({ nullable: true, checkFalsy: true }),
  query("district")
    .isAlphanumeric("vi-VN", { ignore: " -," })
    .withMessage("Province name must not contain special character")
    .bail()
    .trim()
    .optional({ nullable: true, checkFalsy: true }),
  query("capacity")
    .isInt({ min: 0 })
    .withMessage("Capacity must be an integer greater than 0")
    .bail()
    .optional({ nullable: true, checkFalsy: true }),
];
