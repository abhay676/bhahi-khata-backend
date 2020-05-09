class ErrorHandler extends Error {
  constructor (statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const Responsehandler = (data) => {
  return {
    success: true,
    code: 200,
    data
  };
};

module.exports = {
  ErrorHandler,
  Responsehandler
};
