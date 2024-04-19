const articlesRouter = require('express').Router();
const { getAllArticles, getArticleById, patchArticleById } = require('../controllers/articles.controllers')
const { getCommentByArticleId, postCommentByArticleId } = require('../controllers/comments.controllers')

articlesRouter
    .route('/')
    .get(getAllArticles)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleById)

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentByArticleId)
    .post(postCommentByArticleId)


module.exports = articlesRouter