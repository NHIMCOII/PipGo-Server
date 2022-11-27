const { validationResult } = require("express-validator");

const tryCatch = (f) => async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    await f(req, res, next);
  } catch (err) {
    if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
    }
};

const errorHandler = (error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
};

module.exports = {
  errorHandler,
  tryCatch,
};