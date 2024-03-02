const mongoose = require("mongoose");

//make Inquiry schema for mongoose model
const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
 
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    serviceType: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);
