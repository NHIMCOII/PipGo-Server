const CustomError = require("./custom-error.js");

class NotFoundError extends CustomError {
  statusCode = 404;
  responseCode = -604;
  constructor() {
    super("Route not found");
  }

  serializeErrors() {
    return {
      response_code: this.responseCode,
      error: [{ message: "404 Not Found" }],
    };
  }
}

module.exports = NotFoundError;
