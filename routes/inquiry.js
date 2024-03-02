const express = require("express")
const router = express.Router()
const { getInquiries, addInquiry, deleteInquiry } = require("../controllers/inquiry")
const { authenticatedRoute } = require("../middlewares/auth")
const {sendInquiryEmail} = require("../middlewares/mail")
const {inquiryValidator} = require("../validators/inquiry")
const {uploadFile} = require("../middlewares/upload")

router.get("/",authenticatedRoute, getInquiries)
router.post("/",uploadFile,inquiryValidator,sendInquiryEmail, addInquiry)
router.delete("/:id", authenticatedRoute, deleteInquiry)

module.exports = router