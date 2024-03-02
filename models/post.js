const mongoose = require("mongoose")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//make post schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    meta:{
        type: String,
        required: false,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    tags: {
        type: [String],
    },
    slug: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        // required: true,
    },
    status:{
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    postDate: {
        type: Date,
        required: false,
    }

}, { timestamps: true })

postSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Post", postSchema)