const { getAllUsers, getUserByName } = require('../controllers/users.controllers')
const usersRouter = require('express').Router()

usersRouter
    .route('/')
    .get(getAllUsers)

usersRouter
    .route('/:username')
    .get(getUserByName)

module.exports = usersRouter