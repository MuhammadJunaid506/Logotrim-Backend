const mongoose = require("mongoose")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const portfolioSchema = new mongoose.Schema({
    alt: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: false,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
}, { timestamps: true })

portfolioSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Portfolio", portfolioSchema)