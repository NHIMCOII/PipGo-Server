class CustomError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serializeErrors() {
    throw new Error("Method 'serializeErrors()' must be implemented.");
  }
}

module.exports = CustomError;
