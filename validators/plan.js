const { body, validationResult, check } = require('express-validator');
const { ApiResponse } = require("../helpers")
const {plan}  = require("../models/plan")


//validator for plan
exports.planValidator = (method) => {
    switch (method) {
        case 'create': {
            return [
                check('name', "Name is Required").not().isEmpty(),
                check('price', "Price is Required").not().isEmpty(),
                check('category', "Category is Required").not().isEmpty(),
                check('items', "Items are Required").not().isEmpty(),
                function (req, res, next) {
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return res.status(400).json(ApiResponse({}, false, errors.array()[0].msg));
                    }
                    next()
                }
            ]
        }
      
        }
        }
