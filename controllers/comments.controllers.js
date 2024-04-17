const { selectCommentsByArticleId, insertCommentsByArticleId } = require('../models/comments.models')

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    return selectCommentsByArticleId(article_id)
        .then((rows) => {
            res.status(200).send({ comments: rows })
        })
        .catch((err) => {
            next(err)
        })
}

exports.postCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const newComment = req.body
    return insertCommentsByArticleId(article_id, newComment)
        .then(({ rows }) => {
            res.status(201).send({ comment: rows[0] })
        })
        .catch((err) => {
            next(err)
        })
}