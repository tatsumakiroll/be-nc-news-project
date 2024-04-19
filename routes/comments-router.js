const { patchCommentById, removeCommentById } = require('../controllers/comments.controllers')
const commentsRouter = require('express').Router()

commentsRouter
    .route('/:comment_id')
    .patch(patchCommentById)
    .delete(removeCommentById)

module.exports = commentsRouter