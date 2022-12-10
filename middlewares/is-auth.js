const config = require("config");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

/**
 * JWT
 */
exports.authToken = (req, res, next) => {
  if (!req.session.access_token) {
    const err = new Error("You are not authenticated.");
    err.statusCode = 401;
    throw err;
  }

  jwt.verify(
    req.session.access_token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        const error = new Error("Timeout please login again");
        error.statusCode = 403;
        throw error;
      }
      req.user = user;
      next();
    }
  );
};
/**
 * Auth Role
 * @param {[String]} roles
 */
exports.authRole = (roles) => {
  return async (req, res, next) => {
    if (
      !roles.includes(req.user.role) ||
      req.user.status != config.get("account_status.active")
    ) {
      return res.status(401).json({
        message: "Access Denied - Unauthorized",
      });
    }
    next();
  };
};
