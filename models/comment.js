//comment model
const mongoose = require("mongoose")

// commentSchema
const commentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model("Comment", commentSchema)
