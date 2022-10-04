const config = require("config");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.authToken = (req, res, next) => {
  const auth_header = req.headers["authorization"];
  const access_token = auth_header && auth_header.split(" ")[1];
  if (access_token != null) {
    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        const error = new Error("Timeout please login again");
        error.statusCode = 403;
        throw error;
      }
      User.findOne({
        _id: user._id,
      }).then((check_user) => {
        req.userId = check_user._id;
        next();
      });
    });
  } else {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }
};

exports.authRole = (roles) => {
  return async (req, res, next) => {
    const check_user = await User.findById(req.userId)
    if (
      !roles.includes(check_user.role) ||
      check_user.status != config.get("account_status.active")
    ) {
      return res.status(401).json({
        message: "Access Denied - Unauthorized",
      });
    }

    next();
  };
};
