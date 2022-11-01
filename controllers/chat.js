const User = require("../models/user");

exports.chat = async (req, res, next) => {
  try {
    const list = await User.aggregate([
      {
        $match: {
          role: "sale_user",
          status: true
        },
      },
      {
        $sort: {
          contact: 1,
        },
      },
    ]);
    const result = await User.findById(list[0]._id)
    result.contact ++
    result.save()


    res.status(200).json({ message: "Received sale_userId", saleId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
