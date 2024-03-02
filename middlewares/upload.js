const path = require("path");
const multer = require("multer");
const { ApiResponse } = require("../helpers");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    req.body.image = uniqueSuffix + path.extname(file.originalname);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

exports.uploadFile = function (req, res, next) {
  var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/gif" ||
        file.mimetype === "image/webp" ||
        file.mimetype === "application/msword" ||
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"  ||
        file.mimetype === "application/vnd.ms-excel" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      ) {
        cb(null, true);
      } else if (!file) {
        cb(null, false);
        next();
      } else {
        cb(new Error("File Type not Allowed"), false);
      }
    },
  }).single("image");

  upload(req, res, function (err) {
    if (err) {
      return res.json(ApiResponse({}, err.message, false));
    }
    next();
  });
};

exports.uploadJSON = function (req, res, next) {
  var upload = multer({
    storage: storage,
    // fileFilter: (req, file, cb) => {
    //   if (false) {
    //     cb(null, true);
    //   } else if (!file) {
    //     cb(null, false);
    //     next();
    //   } else {
    //     cb(new Error("Image not Allowed"), false);
    //   }
    // },
  }).single("json");

  upload(req, res, function (err) {
    if (err) {
      return res.json(ApiResponse({}, err.message, false));
    }
    next();
  });
};
