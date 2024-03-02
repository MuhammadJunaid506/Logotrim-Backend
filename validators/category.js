const { body, validationResult, check } = require('express-validator');
const { ApiResponse } = require("../helpers")
const category = require("../models/category")

//validator for category
exports.categoryValidator = (method) => {
    switch (method) {
        case 'create': {
        return [
            check('name', "Name is Required").not().isEmpty(),
            // check('description', "Description is Required").not().isEmpty(),
            function (req, res, next) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(ApiResponse({}, false, errors.array()[0].msg));
            }
            next()
            }
        ]
        }
        case 'update': {
       return [
              check('name', "Name is Required").not().isEmpty(),
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