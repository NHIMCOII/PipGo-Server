const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("config");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require("../models/user");
// const ClientA = require("../models/client_a");
// const ClientB = require("../models/client_b");

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    
    const { role, email, phone, avatar, firstName, lastName, gender, dob } =
    req.body;
    
    const check_user = await User.findOne({
      email: email,
      role: role,
    });
    if (check_user) {
      throw new Error("Email already exists, please pick a different one.");
    }

    const salt = await bcrypt.genSalt();
    const hash_password = await bcrypt.hash(
      config.get("default_password"),
      salt
    );

    const user = new User({
      role: role,
      email: email,
      phone: phone,
      password: hash_password,
      avatar: avatar,
      name: {
        first: firstName,
        last: lastName,
      },
      gender: gender,
      dob: dob,
    });

    await user.save();
    res.status(201).json({ message: "New User Created", user: user });
    sgMail.send({
      to: email,
      from: process.env.SENDGRID_EMAIL,
      subject: "Registered",
      html: "<h1>Login with your email and default password (12345678)</h1>",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email, password, role } = req.body;

    const check_user = await User.findOne({ email: email, role: role });

    if (!check_user) {
      const error = new Error("An user with this email could not be found");
      error.statusCode = 404;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, check_user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    let user = {
      _id: check_user._id,
      name: check_user.name,
      role: check_user.role,
    };
    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 60 * 5,
    });
    const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    check_user.refresh_token = refresh_token;
    await check_user.save();
    res.status(200).json({
      userId: check_user._id,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.generateToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw new Error("Not authenticated");
    }

    let check_user = await User.findOne({
      refresh_token: refresh_token,
    });
    if (!check_user) {
      throw new Error("Not authenticated");
    }

    jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, check_user) => {
        if (err) {
          throw new Error("Invalid Token");
        }

        let user = {
          _id: check_user._id,
          name: check_user.name,
          role: check_user.role,
        };

        const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: 60 * 5,
        });

        return res.status(200).json({
          access_token: access_token,
        });
      }
    );
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.reset = async (req, res, next) => {
  crypto.randomBytes(32, async (error, buffer) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const { email, role } = req.body;
      if (error) {
        error.statusCode = 400;
        throw error;
      }
      const token = buffer.toString("hex");
      const user = await User.findOne({ email: email, role: role });
      if (!user) {
        const error = new Error("An user with this email could not be found.");
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
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  });
};

exports.newPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

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
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const check_user = await User.findById(req.userId)
    check_user.refresh_token = undefined
    check_user.save()

    res.status(200).json({ message: "Logout successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
