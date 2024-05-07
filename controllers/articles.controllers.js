const { selectAllArticles, insertArticle, selectArticleById, updateArticle } = require('../models/articles.models')

exports.getAllArticles = (req, res, next) => {
    const { topic, sort_by, order_by, limit, p } = req.query
    return selectAllArticles(sort_by, order_by, topic, limit, p)
        .then((articles) => {
            res.status(200).send({ 
                articles: articles,
                total_count: articles.length
            })
        })
        .catch((err) => {
            next(err)
        })
}

exports.postArticle = (req, res, next) => {
    const newArticle = req.body
    return insertArticle(newArticle)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch((err)=>{
            next(err)
        })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    return selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch((err) => {
            next(err)
        })
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params
    const updateToArticle = req.body
    return updateArticle(updateToArticle, article_id)
        .then((updatedArticle) => {
            res.status(200).send({ article: updatedArticle })
        })
        .catch((err) => {
            next(err)
        })
}