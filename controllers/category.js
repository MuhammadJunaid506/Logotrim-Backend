const Category = require("../models/category")
const { errorHandler } = require("../helpers/dbErrorHandler")
const { ApiResponse } = require("../helpers")

//add category
exports.addCategory = (req, res) => {
    req.body.createdBy = req.user._id
    const category = new Category(req.body)
    category.save((err, category) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        return res.json(ApiResponse(category))
    })
}

//get all categories
exports.getCategories = (req, res) => {
    Category.find({}).sort({name: "ascending"}).exec((err, categories) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!categories) {
            return res.json(ApiResponse({}, "No categories found", false))
        }
        return res.json(ApiResponse(categories))
    })
}

//get category by id
exports.getCategoryById = (req, res) => {
    Category.findById(req.params.id, (err, category) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!category) {
            return res.json(ApiResponse({}, "Category not found", false))
        }
        return res.json(ApiResponse(category))
    })
}

//update category
exports.updateCategory = (req, res) => {
    Category.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, category) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!category) {
            return res.json(ApiResponse({}, "Category not found", false))
        }
        return res.json(ApiResponse(category))
    })
}


//delete category
exports.deleteCategory = (req, res) => {
    Category.findByIdAndDelete(req.params.id, (err, category) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!category) {
            return res.json(ApiResponse({}, "Category not found", false))
        }
        return res.json(ApiResponse(category, "Category deleted successfully"))
    })
}





