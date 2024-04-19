const apiRouter = require('express').Router()
const topicsRouter = require('./topics-router')
const articlesRouter = require('./articles-router')
const commentsRouter = require('./comments-router')
const usersRouter = require ('./users-router')
const { getApi } = require('../controllers/api.controllers')

apiRouter.get('/', getApi)

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articlesRouter)

apiRouter.use('/comments', commentsRouter)

apiRouter.use('/users', usersRouter)

module.exports = apiRouter