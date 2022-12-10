const CustomError = require("./custom-error.js");

class NotAuthenticatedError extends CustomError {
  statusCode = 401;
  responseCode = -601;
  constructor(message) {
    super(message);
  }

  serializeErrors() {
    return {
      response_code: this.responseCode,
      error: [{ message: this.message }],
    };
  }
}

module.exports = NotAuthenticatedError;
