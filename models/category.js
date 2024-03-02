const mongoose = require("mongoose")

//make category schema for mongoose model
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    
    },
}, { timestamps: true })

module.exports = mongoose.model("Category", categorySchema)