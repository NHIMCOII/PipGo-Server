class CustomError extends Error {
  constructor(message) {
    super(message);
  }

  serializeErrors() {
    throw new Error("Method 'serializeErrors()' must be implemented.");
  }
}

module.exports = CustomError;
