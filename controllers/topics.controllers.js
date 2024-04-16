const { selectAllTopics } = require('../models/topics.models')

exports.getAllTopics = (req, res, next) => {
    return selectAllTopics()
        .then(({ rows }) => {
            res.status(200).send({ topics: rows })
        })
}
