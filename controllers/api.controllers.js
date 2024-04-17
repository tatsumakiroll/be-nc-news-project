const { selectApi } = require('../models/api.models')

exports.getApi = (req, res, next) => {
    return selectApi()
        .then((response) => {
            res.status(200).send({ availableApi: response })
        })
}