const jwt = require("jsonwebtoken");
const { ApiResponse } = require("../helpers");
require("dotenv").config();

exports.authenticatedRoute = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {
        return res.status(403).send(ApiResponse({}, "Access Forbidden", false));
    }
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send(ApiResponse({}, "Invalid Token, Please sign in again", false))
    }
    return next();
};

