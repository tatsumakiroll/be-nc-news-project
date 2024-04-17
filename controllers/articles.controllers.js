const { selectAllArticles, selectArticleById, updateArticle } = require('../models/articles.models')

exports.getAllArticles = (req, res, next) => {
    return selectAllArticles().then(({ rows }) => {
        res.status(200).send({ articles: rows })
    })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    return selectArticleById(article_id).then((article) => {
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
    .then((updatedArticle)=>{
        res.status(200).send({article:updatedArticle})
    })
    .catch((err)=>{
        next(err)
    })
}