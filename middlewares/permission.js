const config = require("config");

const User = require("../models/user");

exports.canViewProfile = async (req, res, next) => {
  const check_user = await User.findById(req.userId);
  const userId = req.params.userId;

  const permission = check_user.role == "admin" || check_user._id == userId;
  if (!permission) {
    return res.status(401).json({
        message: "Access Denied - Cant view profile",
      });
  }
  next();
};
