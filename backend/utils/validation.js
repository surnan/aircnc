// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)


const handleValidationErrors = (req, _res, next) => {
  //errors are written to the req by "check"
  //handler is run last to search body for any of these errors
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request");
    // err.errors = errors;
    err.status = 400;
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors
};
