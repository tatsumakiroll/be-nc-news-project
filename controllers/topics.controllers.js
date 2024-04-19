const { selectAllTopics } = require('../models/topics.models')

exports.getAllTopics = (req, res, next) => {
    return selectAllTopics()
        .then((topics) => {
            res.status(200).send({ topics: topics })
        })
        .catch((err) => {
            next(err)
        })
}
