const { body, validationResult, check } = require('express-validator');
const { ApiResponse } = require("../helpers")
const user = require("../models/user")

exports.inquiryValidator = [
  check('email', "Email is Required").not().isEmpty().isEmail().withMessage("Email is Invalid"),
  body('name').not().isEmpty().withMessage("Full Name is Required"),
  // body('lastName').not().isEmpty().withMessage("Last Name is Required"),
  body('serviceType').not().isEmpty().withMessage("Service Type is Required"),
  body('message').not().isEmpty().withMessage("Message is Required"),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ApiResponse({}, false, errors.array()[0].msg));
    }
    next()
  }
]