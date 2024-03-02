const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//default api response format
exports.ApiResponse = (data = {}, message = "", status = true) => {
  return {
    status: status,
    message: message,
    data: data,
  };
};

//generate password based on caps, smalls and numbers.
exports.generateString = (length, onlyCaps = false) => {
  length = length ? length : 8;
  let charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  if (onlyCaps) {
    charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

//check file extention
exports.checkFileExtention = (file, extentions) => {
  const type = file.originalFilename.split(".").pop() || "png";
  const validTypes = extentions ? extentions : ["jpg", "jpeg", "png"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};

exports.generateToken = (user) => {
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET
  );
  return token;
};

exports.validateToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.json(ApiResponse({}, { error: "Invalid Token" }, false));
  }
};

exports.verifyToken = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.json(ApiResponse({}, { error: "Invalid Token" }, false));
    } else {
      req.user = authData;
      next();
    }
  });
};

exports.slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, "-") //replace spaces with -
    .replace(/[^\w-]+/g, "") //remove all non-word chars
    .replace(/--+/g, "-") //replace multiple - with single -
    .replace(/^-+/, "") //trim - from start of text
    .replace(/-+$/, ""); //trim - from end of text
}

//generate token with expiry time
exports.generateTokenWithExpiry = (user, expiryTime=604800) => {
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: expiryTime }
  );
  return token;
}


//validate token with expiry time
exports.validateTokenWithExpiry = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.json(ApiResponse({}, { error: "Invalid Token" }, false));
  }
}

//verify token with expiry time
exports.verifyTokenWithExpiry = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.json(ApiResponse({}, { error: "Invalid Token" }, false));
    } else {
      req.user = authData;
      next();
    }
  });
}
