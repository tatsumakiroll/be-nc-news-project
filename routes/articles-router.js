const { getAllArticles, postArticle, getArticleById, patchArticleById } = require('../controllers/articles.controllers')
const { getCommentByArticleId, postCommentByArticleId } = require('../controllers/comments.controllers')
const articlesRouter = require('express').Router();

articlesRouter
    .route('/')
    .get(getAllArticles)
    .post(postArticle)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleById)

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentByArticleId)
    .post(postCommentByArticleId)


module.exports = articlesRouter