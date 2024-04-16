const { selectAllArticles, selectArticleById } = require('../models/articles.models')

exports.getAllArticles = (req, res, next) => {
    return selectAllArticles().then(({rows})=>{
        res.status(200).send({articles: rows})
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