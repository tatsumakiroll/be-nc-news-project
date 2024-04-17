const { selectCommentByArticleId, insertCommentByArticleId, deleteCommentById } = require('../models/comments.models')

exports.getCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params
    return selectCommentByArticleId(article_id)
        .then((rows) => {
            res.status(200).send({ comments: rows })
        })
        .catch((err) => {
            next(err)
        })
}

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const newComment = req.body
    return insertCommentByArticleId(article_id, newComment)
        .then(({ rows }) => {
            res.status(201).send({ comment: rows[0] })
        })
        .catch((err) => {
            next(err)
        })
}

exports.removeCommentById = (req, res, next) => {
    const {comment_id} = req.params
    return deleteCommentById(comment_id)
    .then(()=>{
        res.status(204).send()
    })
    .catch((err)=>{
        next(err)
    })
}