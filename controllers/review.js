const Review = require("../models/review.js")
const { errorHandler } = require("../helpers/dbErrorHandler")
const { ApiResponse } = require("../helpers")
const fs = require("fs")

//add review
exports.addReview = (req, res) => {
    const review = new Review(req.body);
    review.save((err, review) => {
        if (err) {
        return res.json(ApiResponse({},errorHandler(err) ? errorHandler(err) : err.message, false));
        }
        return res.json(ApiResponse(review,"Review Added Successfully",true));
    });
    }

    //get all reviews
    exports.getReviews = (req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        Review.find({}).limit(limit).populate("category").exec((err, reviews) => {
            if (err) {
                return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
            }
            if (!reviews) {
                return res.json(ApiResponse({}, "No reviews found", false))
            }
            return res.json(ApiResponse(reviews))
        }
        )
    }

    //get review by id
    exports.getReviewById = (req, res) => {  
        Review.findById(req.params.id).populate("category").exec((err, review) => {
            if (err) {
                return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
            }
            if (!review) {
                return res.json(ApiResponse({}, "Review not found", false))
            }
            return res.json(ApiResponse(review))
        })
    }



    // get review by category
    exports.getReviewsByCategory = (req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        Review.find({category: req.params.id}).limit(limit).exec((err, reviews) => {
            if (err) {
                return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
            }
            if (!reviews) {
                return res.json(ApiResponse({}, "No reviews found", false))
            }
            return res.json(ApiResponse(reviews))
        }
        )
    }

    //edit review
    exports.editReview = (req, res) => {
        if(req.body.image){
            Review.findById(req.params.id, (err, review) => {
                if (err) {
                    return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
                }
                if (review.image) {
                    fs.unlinkSync(`./uploads/${review.image}`);
                }
            })  
        }





        Review.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, review) => {
            if (err) {
                return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
            }
            if (!review) {
                return res.json(ApiResponse({}, "Review not found", false))
            }
            return res.json(ApiResponse(review,"Review updated successfully",true))
        }
        )
    }

    //delete review
    exports.deleteReview = (req, res) => {
        Review.findByIdAndDelete(req.params.id, (err, review) => {
            if (err) {
                return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
            }
            if (!review) {
                return res.json(ApiResponse({}, "Review not found", false))
            }
            if (review.image) {
                fs.unlinkSync(`./uploads/${review.image}`);
            }
            return res.json(ApiResponse(review,"Review deleted successfully",true))
        }
        )
    }