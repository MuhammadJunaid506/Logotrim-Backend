const User = require("../models/user");
const { generateTokenWithExpiry, validateToken, verifyToken } = require("../helpers");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { ApiResponse } = require("../helpers");

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email, password })
    .then((user) => {
      if (!user) {
        return res.json(ApiResponse({}, "Invalid Email or Password", false));
      }
      if(!user.authenticate(password)){
        return res.json(ApiResponse({}, "Invalid Email or Password", false));
      }
      user.hashed_password = undefined;
      res.json(ApiResponse({ user, token: generateTokenWithExpiry(user) }));
    })
    .catch((err) => {
      res.json(
        ApiResponse(
          {},
          errorHandler(err) ? errorHandler(err) : err.message,
          false
        )
      );
    });
};


//signup 
exports.signup = (req, res) => {
  const { name, email, password, } = req.body;
  let user = new User({ name, email, password });
  user
    .save()
    .then((user) => {
      user.hashed_password = undefined;
      res.json(ApiResponse({ user, token: generateTokenWithExpiry(user) }));
    })
    .catch((err) => {
      res.json(
        ApiResponse(
          {},
          errorHandler(err) ? errorHandler(err) : err.message,
          false
        )
      );
    });
}