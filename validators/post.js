const { body, validationResult, check } = require('express-validator');
const { ApiResponse } = require("../helpers")
const post = require("../models/post")

//post validator
exports.postValidator = (method) => {
    switch (method) {
        case 'create': {
            return [
                check('title', "Title is Required").not().isEmpty(),
                check('content', "Content is Required").not().isEmpty(),
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