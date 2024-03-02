const Post = require("../models/post")
const { errorHandler } = require("../helpers/dbErrorHandler")
const { ApiResponse, slugify } = require("../helpers")


//generate unique post slug
exports.generateUniqueSlug = async (req, res, next) => {
    if (req.body.slug) {
        const post = await Post.findOne({ slug: req.body.slug })
        if (post) {
            req.body.slug = `${slug}-${Math.floor(Math.random() * 100)}`
        } else {
            req.body.slug = slug
        }
    } else {
        const slug = slugify(req.body.title)
        const post = await Post.findOne({ slug })
        if (post) {
            req.body.slug = `${slug}-${Math.floor(Math.random() * 100)}`
        }
        else {
            req.body.slug = slug
        }
    }
    next()
}