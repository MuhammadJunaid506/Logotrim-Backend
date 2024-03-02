const express = require("express")
const router = express.Router()
const { getCategories, addCategory, getCategoryById, updateCategory, deleteCategory } = require("../controllers/category")
const { authenticatedRoute } = require("../middlewares/auth")
const {categoryValidator} = require("../validators/category")

router.get("/", getCategories)
router.get("/:id", getCategoryById)
router.post("/", authenticatedRoute,categoryValidator('create'), addCategory)
router.put("/:id", authenticatedRoute,categoryValidator('update'), updateCategory)
router.delete("/:id", authenticatedRoute, deleteCategory)

module.exports = router