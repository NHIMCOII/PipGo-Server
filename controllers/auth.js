const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("config");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require("../models/user");

exports.login = async (req, res, next) => {
  const { email, password, role } = req.body;

  const check_user = await User.findOne({ email: email, role: role });

  if (!check_user) {
    const error = new Error(
      "Your email or role is incorrect, please try again"
    );
    error.statusCode = 404;
    throw error;
  }

  const isEqual = await bcrypt.compare(password, check_user.password);
  if (!isEqual) {
    const error = new Error("Wrong password!");
    error.statusCode = 401;
    throw error;
  }

  const user = {
    _id: check_user._id,
    email: check_user.email,
    name: check_user.name,
    role: check_user.role,
    status: check_user.status,
  };
  const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: config.get("default.access_token_exp"),
  });
  const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24 * 90,
  });

  check_user.refresh_token = refresh_token;
  await check_user.save();
  req.session = { access_token };
  req.user = user;

  res.status(200).json({
    message: "Login Successfully",
    data: { refresh_token },
  });
};

exports.generateToken = async (req, res, next) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    const err = new Error("Not authenticated");
    err.statusCode = 401;
    throw err;
  }

  let check_user = await User.findOne({
    refresh_token: refresh_token,
  });
  if (!check_user) {
    req.session = null;
    req.user = null;
    const err = new Error("Refresh token not found");
    err.statusCode = 404;
    throw err;
  }
  const user = {
    _id: check_user._id,
    email: check_user.email,
    name: check_user.name,
    role: check_user.role,
    status: check_user.status,
  };
  const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: config.get("default.access_token_exp"),
  });

  req.session = { access_token };

  return res.status(200).json({
    message: "Refresh Token Successfully",
  });
};

exports.reset = async (req, res, next) => {
  crypto.randomBytes(32, async (error, buffer) => {
    const { email, role } = req.body;
    if (error) {
      error.statusCode = 400;
      throw error;
    }
    const token = buffer.toString("hex");
    const user = await User.findOne({ email: email, role: role });
    if (!user) {
      const error = new Error(
        "Your email or role is incorrect, please try again"
      );
      error.statusCode = 401;
      throw error;
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    user.save();
    res.status(200).json({ message: "Reset Token saved" });
    sgMail.send({
      to: email,
      from: process.env.SENDGRID_EMAIL,
      subject: "Password Reset",
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:8080/auth/reset/${token}">link</a> to set a new password</p>
        `,
    });
  });
};

exports.resetPassword = async (req, res, next) => {
  const { newPassword } = req.body;
  const token = req.params.token;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    const error = new Error("Your reset token is expired !");
    error.statusCode = 401;
    throw error;
  }

  const salt = await bcrypt.genSalt();
  const hashedPw = await bcrypt.hash(newPassword, salt);
  user.password = hashedPw;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  user.save();
  res.status(200).json({ message: "New password updated" });
  sgMail.send({
    to: user.email,
    from: process.env.SENDGRID_EMAIL,
    subject: "New password",
    html: "<p>You successfully updated new password</p>",
  });
};

exports.logout = async (req, res, next) => {
  const check_user = await User.findById(req.user._id);
  check_user.refresh_token = undefined;
  check_user.save();
  req.user = null;
  req.session = null;

  res.status(200).json({ message: "Logout successfully" });
};
