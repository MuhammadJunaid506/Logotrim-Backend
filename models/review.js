const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: false,
        min: 1,
        max: 5,
    },
    image: {
        type: String,
        required: false,
    },
    alt:{
        type: String,
        required: false,
    },
    title:{
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: false,
    },
    customer:{
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: false,    
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model("Review", reviewSchema)


