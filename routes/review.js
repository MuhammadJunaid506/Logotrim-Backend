const express = require("express")
const router = express.Router()
const { authenticatedRoute } = require('../middlewares/auth')
const {uploadFile} = require('../middlewares/upload')
const { addReview, getReviews,getReviewById, getReviewsByCategory, editReview, deleteReview } = require("../controllers/review")

router.get("/", getReviews)
router.get("/:id", getReviewById)
router.get("/category/:id", getReviewsByCategory)
router.post("/", authenticatedRoute,uploadFile, addReview)
router.put("/:id", authenticatedRoute,uploadFile, editReview)
router.delete("/:id", authenticatedRoute, deleteReview)

module.exports = router