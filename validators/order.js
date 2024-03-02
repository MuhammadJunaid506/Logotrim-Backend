const { body, validationResult, check } = require('express-validator');
const { ApiResponse } = require("../helpers")
const order = require("../models/order")

//validator for order
exports.orderValidator = (method) => {
    switch (method) {
        case 'create': {
            return [
                check('name', "Name is Required").not().isEmpty(),
               check('company', "Company is Required").not().isEmpty(),
               check('email', "Email is Required").not().isEmpty(),
               check('phone', "Phone is Required").not().isEmpty(),
               check('plan', "Plan is Required").not().isEmpty(),
               check('stripeToken', "Stripe Token is Required").not().isEmpty(),
               
                function (req, res, next) {
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return res.status(400).json(ApiResponse({}, errors.array()[0].msg,false));
                    }
                    next()
                }
            ]
        }
        case 'update': {
            return [
               check('status', "Status is Required").not().isEmpty(),
                function (req, res, next) {
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return res.status(400).json(ApiResponse({}, errors.array()[0].msg,false));
                    }
                    next()
                }
            ]
        }
    }
    }
