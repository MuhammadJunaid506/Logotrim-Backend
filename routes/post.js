const express = require("express")
const { authenticatedRoute } = require("../middlewares/auth")
const { generateUniqueSlug } = require("../middlewares/post")
const { addPost, getPosts, getPostById, updatePost, deletePost, getPostBySlug, importPosts,exportPosts } = require("../controllers/post")
const { uploadFile , uploadJSON} = require("../middlewares/upload")
const { postValidator } = require("../validators/post")
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get("/", getPosts)
router.get("/:id", getPostById)
router.get("/slug/:slug", getPostBySlug)
router.post("/", authenticatedRoute, uploadFile, generateUniqueSlug, postValidator('create'), addPost)
router.put("/:id", authenticatedRoute, uploadFile, updatePost)
router.delete("/:id", authenticatedRoute, deletePost)
router.post("/import",authenticatedRoute, uploadJSON, importPosts)
router.get("/data/export",  exportPosts)
// router.put("/edit/changePosts", updatePostDate)

module.exports = router
