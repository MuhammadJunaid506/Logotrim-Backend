const Popup = require('../models/popup')
const { errorHandler } = require("../helpers/dbErrorHandler")
const { ApiResponse } = require("../helpers")



exports.getPopup = (req, res) => {
    Popup.find({}).exec((err, popup) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!popup) {
            return res.json(ApiResponse({}, "No popup found", false))
        }
        return res.json(ApiResponse(popup))
    }
    )
}


exports.addPopup = (req, res) => {
    const popup = new Popup(req.body)
    popup.save((err, popup) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        return res.json(ApiResponse(popup,"Popup added successfully",true))
    })
}

exports.updatePopup = (req, res) => {
    Popup.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, popup) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!popup) {
            return res.json(ApiResponse({}, "Popup not found", false))
        }
        return res.json(ApiResponse(popup,"Popup updated successfully",true))
    })
}


exports.deletePopup = (req, res) => {
    Popup.findByIdAndDelete(req.params.id, (err, popup) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!popup) {
            return res.json(ApiResponse({}, "Popup not found", false))
        }
        return res.json(ApiResponse(popup,"Popup deleted successfully",true))
    })
}

