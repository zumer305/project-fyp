class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message);              // ✅ initializes parent Error(message)
    this.statusCode = statusCode; // ✅ define custom status
  }
}

module.exports = ExpressError;