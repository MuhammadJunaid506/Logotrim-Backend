const mongoose = require("mongoose")

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true

    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    }
}, { timestamps: true })

module.exports = mongoose.model("Plan", planSchema)