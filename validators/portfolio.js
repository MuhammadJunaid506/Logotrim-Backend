const { body, validationResult, check } = require('express-validator');
const { ApiResponse } = require("../helpers")
const portfolio = require("../models/portfolio");


//validator for portfolio
exports.portfolioValidator = (method) => {
    switch (method) {
        case 'create': {
            return [
                check('category', "Category is Required").not().isEmpty(),
                check('image', "Image is Required").not().isEmpty(),
                check('alt', "Alt Text is Required").not().isEmpty(),
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
                check('category', "Category is Required").not().isEmpty(),
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