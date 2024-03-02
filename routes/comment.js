const express = require('express')
const router = express.Router()

const {addComment,getComments,getCommentById,deleteComment} = require('../controllers/comment')

router.post('/', addComment)
router.get('/', getComments)
router.get('/:id', getCommentById)
router.delete('/:id', deleteComment)

module.exports = router
