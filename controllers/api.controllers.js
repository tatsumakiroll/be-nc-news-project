const { selectApi } = require('../models/api.models')

exports.getApi = (req, res, next) => {
    return selectApi()
        .then((api) => {
            res.status(200).send({ availableApi: api })
        })
}