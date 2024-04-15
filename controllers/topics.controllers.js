const { selectApi, selectAllTopics } = require('../models/topics.models')

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