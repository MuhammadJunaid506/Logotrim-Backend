const Comment = require('../models/comment')
const { errorHandler } = require("../helpers/dbErrorHandler")
const { ApiResponse } = require("../helpers")

//add comment
exports.addComment = (req, res) => {
    const comment = new Comment(req.body)
    comment.save((err, comment) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        return res.json(ApiResponse({comment}, "Comment added successfully",true))
    })
}


//get all comments
exports.getComments = (req, res) => {
    Comment.find({}, (err, comments) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!comments) {
            return res.json(ApiResponse({}, "No comments found", false))
        }
        return res.json(ApiResponse(comments))
    })
}

//get comment by post id
exports.getCommentById = (req, res) => {
    Comment.find({post:req.params.id}, (err, comment) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!comment) {
            return res.json(ApiResponse({}, "Comment not found", false))
        }
        return res.json(ApiResponse(comment))
    })
}


//delete comment
exports.deleteComment = (req, res) => {
    Comment.findByIdAndDelete(req.params.id, (err, comment) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!comment) {
            return res.json(ApiResponse({}, "Comment not found", false))
        }
        return res.json(ApiResponse({}, "Comment deleted successfully", true))
    })
}

