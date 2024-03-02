const mongoose = require('mongoose')


const popupSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    hyperLink:{
        type:String,
        required:false
    }
},{timestamps:true})

module.exports = mongoose.model('Popup',popupSchema)
