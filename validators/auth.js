const { body, validationResult, check } = require('express-validator');
const { ApiResponse } = require("../helpers")
const user = require("../models/user")

exports.signinValidator = [
  check('email', "Email is Required").not().isEmpty().isEmail().withMessage("Email is Invalid"),
  body('password').not().isEmpty().withMessage("Password is Required"),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ApiResponse({}, false, errors.array()[0].msg));
    }
    next()
  }
]