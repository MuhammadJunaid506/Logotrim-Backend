const express = require('express')
const {getPopup,addPopup,updatePopup,deletePopup} = require('../controllers/popup')
const { authenticatedRoute } = require('../middlewares/auth')
const router = express.Router()
const {uploadFile} = require('../middlewares/upload')

router.get("/", getPopup)
router.post("/", authenticatedRoute,uploadFile,addPopup)
router.put("/:id", authenticatedRoute,uploadFile, updatePopup)
router.delete("/:id", authenticatedRoute, deletePopup)

module.exports = router