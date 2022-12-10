const CustomError = require("./custom-error.js");

class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super("Route not found");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return {
      error: [{ message: "404 Not Found" }],
    };
  }
}

module.exports = NotFoundError;
