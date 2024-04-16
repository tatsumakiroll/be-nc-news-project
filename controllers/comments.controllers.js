const {selectCommentsByArticleId} = require('../models/comments.models')

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    return selectCommentsByArticleId(article_id).then((rows)=>{
        res.status(200).send({comments: rows})
    })
}