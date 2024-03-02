const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    orderId:{
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    },
    status: {
        type: String,
        default: "Recieved"
    },
    image: {
        type: String,
        required: false,
    },
    requirements: {
        name: {
            type: String,
            required: false
        },
        email:{
            type: String,
            required: false
        },
        logoText: {
            type: String,
            required: false
        },
        tagline: {
            type: String,
            required: false
        },
        details: {
            type: String,
            required: false
        },
        competitors : {
            type: String,
            required: false,
        },
        likedLogos: {
            type: String,
            required: false,
        },
        dislikedLogos: {
            type: String,
            required: false,
        },
        
        colors:{    
            type:Array,
            required: false,
        },
        fontStyle: {
            type: String,
            required: false
        },
        logoCategory: {
            type: Array,
            required: false
        },
        otherInfo: {
            type: String,
            required: false
        }
    },
}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)