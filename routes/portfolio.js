const express = require('express')
const { list, getByCategory, add, get, update, remove } = require('../controllers/portfolio')
const { authenticatedRoute } = require('../middlewares/auth')
const router = express.Router()
const {uploadFile} = require('../middlewares/upload')
const {portfolioValidator} = require('../validators/portfolio')

router.get("/", list)
router.get("/:id", get)
router.get("/category/:category", getByCategory)
router.post("/", authenticatedRoute,uploadFile,portfolioValidator('create'),add)
router.put("/:id", authenticatedRoute,uploadFile, update)
router.delete("/:id", authenticatedRoute, remove)

module.exports = router