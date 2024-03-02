const Category = require("../models/category")
const User = require("../models/user")

exports.initialize = () => {
    User.findOne({ email: process.env.ADMIN_EMAIL }, (err, user) => {
        if (err) {
            console.log(err.message ? err.message : "Unknown error occured")
        }
        if (!user) {
            const _user = new User({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD })
            _user.save((err, user) => {
                if (err) {
                    console.log(err.message ? err.message : "Failed to initialize user")
                }
                if (!user) {
                    console.log("Failed to initialize user")
                }
            })
        }
    })
    Category.findOne({ name: "Uncategorized" }, (err, category) => {
        if (err) {
            console.log(err.message ? err.message : "Unknown error occurred")
        }
        if (!category) {
            const _category = new Category({ name: "Uncategorized" })
            _category.save((err, category) => {
                if (err) {
                    console.log(err.message ? err.message : "Failed to initialize category")
                }
                if (!category) {
                    console.log("Failed to initialize category")
                }
            })
        }
    })
}