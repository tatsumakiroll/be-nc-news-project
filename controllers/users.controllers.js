const { selectAllUsers, selectUserByName } = require('../models/users.models')

exports.getAllUsers = (req, res, next) => {
    return selectAllUsers()
        .then((users) => {
            res.status(200).send({ users: users })
        })
}

exports.getUserByName = (req, res, next) => {
    const { username } = req.params
    return selectUserByName(username)
        .then((user) => {
            res.status(200).send({ user: user })
        })
        .catch((err) => {
            next(err)
        })
}