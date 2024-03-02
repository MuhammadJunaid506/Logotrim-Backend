// getInquiries, addInquiry, deleteInquiry

const Inquiry = require("../models/inquiry");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { ApiResponse } = require("../helpers");




exports.getInquiries = (req, res) => {
  Inquiry.find({}, (err, inquiry) => {
    if (err) {
      return res.json(
        ApiResponse(
          {},
          errorHandler(err) ? errorHandler(err) : err.message,
          false
        )
      );
    } else if (!inquiry) {
      return res.json(ApiResponse({}, "No Inquiries Found", true));
    }
    return res.json(ApiResponse(inquiry));
  });
};

exports.addInquiry = (req, res) => {
  const inquiry = new Inquiry(req.body);
  inquiry.save(async (err, newInquiry) => {
    if (err) {
      return res.json(
        ApiResponse(
          {},
          errorHandler(err) ? errorHandler(err) : err.message,
          false
        )
      );
    }

  

    // console.log(info);
    return res.json(ApiResponse(newInquiry));
  });
};

//delete inquiry
exports.deleteInquiry = (req, res) => {
  Inquiry.findByIdAndDelete(req.params.id, (err, inquiry) => {
    if (err) {
      return res.json(
        ApiResponse(
          {},
          errorHandler(err) ? errorHandler(err) : err.message,
          false
        )
      );
    }
    return res.json(ApiResponse(inquiry, "Inquiry Deleted Successfully", true));
  });
};
