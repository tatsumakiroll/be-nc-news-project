const { selectApi, selectAllTopics, selectArticleById } = require('../models/topics.models')

exports.getApi = (req, res, next) => {
    return selectApi().then((response) => {
        res.status(200).send({ availableApi: response })
    })
}

exports.getAllTopics = (req, res, next) => {
    return selectAllTopics()
        .then(({ rows }) => {
            res.status(200).send({ topics: rows }) 
        })
}

exports.getArticleById = (req, res, next)=>{
    const {article_id} = req.params
    return selectArticleById(article_id).then((article)=>{
        res.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}