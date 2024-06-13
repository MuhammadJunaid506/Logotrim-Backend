const { ApiResponse } = require("../helpers");
require("dotenv").config();
const Plan = require("../models/plan");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const moment = require("moment");


let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
  from: process.env.SMTP_USER,
});

let ordertransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true, 
  auth: {
    user: process.env.SMTP_USER_ORDER, 
    pass: process.env.SMTP_PASSWORD_ORDER | "0rd#R-9632", 
  },
  tls: {
    rejectUnauthorized: false,
  },
  from: process.env.SMTP_USER_ORDER,

})

exports.sendInquiryEmail = async (req, res, next) => {
  try {
    let info = await transporter.sendMail({
      from: `Logo Trim  <${process.env.SMTP_USER}>`,
      to: ["support@logotrim.com"],
      subject: "Logo Trim Inquiry",
      text: "Hi There! Thankyou for reaching out our support team will contact you within 48 hours.",
      html: `<div><p>Name : ${req.body.name}</p></div>` + `<div><p>Email : ${req.body.email}</p></div>` + `<div><p>Phone # : ${req.body.phone}</p></div>` + `<div><p>Service Type : ${req.body.serviceType}</p></div>` + `<div><p>Message : ${req.body.message}</p></div>`,
      attachments: [
        {
          filename: req?.file?.originalname,
          path: req?.file?.path,
        },
      ],
    });
    return next();
  } catch (error) {
    return res.status(400).json(ApiResponse({}, error.message, false));
  }
};

exports.sendCheckoutEmail = async (req, res, next) => {
  req.body.orderId = "lm_" + Math.floor(100000 + Math.random() * 900000);
  try {
    const planAggregate = [
      {
        $match: { _id: new mongoose.Types.ObjectId(req.body?.plan) },
      },
      {
        $addFields: {
          discountValue: {
            $multiply: [{ $divide: ["$discount", 100] }, "$price"],
          },
        },
      },
      {
        $addFields: {
          discountedPrice: { $subtract: ["$price", "$discountValue"] },
        },
      },
    ];

    //get plan by id in req.body.plan and get discount value and discounted price
    let plan = await Plan?.aggregate(planAggregate).exec();
    console.log("req.body", req.body);
    let info = await ordertransporter?.sendMail({
      from: `Logo Trim  <${process.env.SMTP_USER_ORDER}>`,
      to: [req.body.email, "order@logotrim.com"],
      subject: "Your Logo Trim order has been received!",
      text: "Hi There! Thankyou for your purchase",
      html:
        `<div marginwidth="0" marginheight="0" style="padding:0"> <div id="m_-7296482839256694119m_1762793087866251243wrapper" dir="ltr" style="background-color:#f7f7f7;margin:0;padding:70px 0;width:100%" bgcolor="#f7f7f7" width="100%"> <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%"><tbody><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="600" id="m_-7296482839256694119m_1762793087866251243template_container" style="background-color:#fff;border:1px solid #dedede;border-radius:3px" bgcolor="#fff"><tbody><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" id="m_-7296482839256694119m_1762793087866251243template_header" style="background-color:#ad0103;color:#fff;border-bottom:0;font-weight:bold;line-height:100%;vertical-align:middle;font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif;border-radius:3px 3px 0 0" bgcolor="#ad0103"><tbody><tr><td id="m_-7296482839256694119m_1762793087866251243header_wrapper" style="padding:36px 48px;display:block"><h1 style="font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif;font-size:30px;font-weight:300;line-height:150%;margin:0;text-align:left;color:#fff;background-color:inherit" bgcolor="inherit">Thank you for your order</h1></td></tr></tbody></table></td></tr>` +
        '<tr><td align="center" valign="top">' +
        '<table border="0" cellpadding="0" cellspacing="0" width="600" id="m_-7296482839256694119m_1762793087866251243template_body"><tbody><tr><td valign="top" id="m_-7296482839256694119m_1762793087866251243body_content" style="background-color:#fff" bgcolor="#fff">' +
        `<table border="0" cellpadding="20" cellspacing="0" width="100%"><tbody><tr><td valign="top" style="padding:48px 48px 32px"><div id="m_-7296482839256694119m_1762793087866251243body_content_inner" style="color:#636363;font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif;font-size:14px;line-height:150%;text-align:left" align="left"><p style="margin:0 0 16px">Hi ${
          req.body?.name
        },</p><p style="margin:0 0 16px">Just to let you know — weve received your order and it is now being processed:</p><h2 style="color:#ad0103;display:block;font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left">[Order # ${
          req.body?.orderId
        }] (${moment().format(
          "MMMM DD YYYY"
        )}) </h2><div style="margin-bottom:40px">` +
        `<table border="1 cellpadding="8" cellspacing="0" style="width:500px; border-color:#f2f2f2; vertical-align:middle;width:100%;font-family:"Helvetica Neue",Helvetica,Roboto,Arial,sans-serif" width="100%"><thead></thead>` +
        `<tbody><tr><th scope="row" colspan="2" style="color:#636363;vertical-align:middle;padding:12px;text-align:left;" align="left">Package :</th><td style="color:#636363;vertical-align:middle;padding:12px;text-align:left;" align="left">${req.body.planObj.name}</td></tr><tr><th scope="row" colspan="2" style="color:#636363;vertical-align:middle;padding:12px;text-align:left;" align="left">Discount: </th><td style="color:#636363;vertical-align:middle;padding:12px;text-align:left;" align="left">${req.body.planObj.discount} %</td></tr><tr><th scope="row" colspan="2" style="color:#636363;vertical-align:middle;padding:12px;text-align:left;" align="left">SubTotal : </th><td style="color:#636363;vertical-align:middle;padding:12px;text-align:left;" align="left">$ ${req.body.planObj.price}</td></tr><tr><th scope="row" colspan="2" style="color:#636363;vertical-align:middle;padding:12px;text-align:left" align="left">Payment method:</th><td style="color:#636363;vertical-align:middle;padding:12px;text-align:left" align="left">Credit Card (Stripe)</td></tr><tr><th scope="row" colspan="2" style="color:#636363;vertical-align:middle;padding:12px;text-align:left;" align="left">Total:</th><td style="color:#636363;vertical-align:middle;padding:12px;text-align:left;" align="left">$ ${req.body.amount}</td></tr>` +
        `</tbody></table></div>` +
        '<p style="margin:0 0 16px">Thanks for visiting <a href="http://logomagicians.com" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://logomagicians.com&amp;source=gmail&amp;ust=1663851704079000&amp;usg=AOvVaw2O1l3Y4U-oM36-rPZhtigv">logomagicians.com</a>. Kindly keep in touch with us for any queries at <a href="mailto:support@logomagicians.com" target="_blank">support@logomagicians.com</a></p></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td align="center" valign="top">' +
        '<table border="0" cellpadding="10" cellspacing="0" width="600" id="m_-7296482839256694119m_1762793087866251243template_footer"><tbody><tr><td valgn="top" style="padding:0;border-radius:6px">' +
        '<table border="0" cellpadding="10" cellspacing="0" width="100%"><tbody><tr><td colspan="2" valign="middle" id="m_-7296482839256694119m_1762793087866251243credit" style="border-radius:6px;border:0;color:#8a8a8a;font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif;font-size:12px;line-height:150%;text-align:center;padding:24px 0" align="center"></td></tr></tbody></table></td></tr></tbody></table><div class="yj6qo"></div><div class="adL"></div></div><div class="adL"></div></div>',
    });
    return next();
  } catch (error) {
    return res.status(400).json(ApiResponse({}, error.message, false));
  }
};