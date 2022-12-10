const { ValidationError } = require("express-validator");
const CustomError = require("./custom-error");

class RequestValidationError extends CustomError {
  statusCode = 422;
  ResponseCode = -622;

  constructor(errors) {
    super("Invalid Request Body");
    this.errors = errors;
  }

  serializeErrors() {
    return {
      response_code: this.ResponseCode,
      errors: this.errors.map((err) => {
        return { message: err.msg, field: err.param };
      }),
    };
  }
}

module.exports = RequestValidationError;
