const express = require('express');
const app = express();
const { getApi } = require('./controllers/api.controllers')
const { getAllTopics } = require('./controllers/topics.controllers')
const { getCommentByArticleId, postCommentByArticleId, removeCommentById } = require('./controllers/comments.controllers')
const { getAllArticles, getArticleById, patchArticleById } = require('./controllers/articles.controllers')
const { getAllUsers } = require('./controllers/users.controllers')

app.use(express.json())

app.get("/api", getApi)

app.get("/api/topics", getAllTopics)

app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id", getArticleById)
app.patch("/api/articles/:article_id", patchArticleById)

app.get('/api/articles/:article_id/comments', getCommentByArticleId)
app.post('/api/articles/:article_id/comments', postCommentByArticleId)
app.delete('/api/comments/:comment_id', removeCommentById)

app.get('/api/users', getAllUsers)

app.all('*', (req, res, next) => {
    res.status(404).send({ message: 'Not found' })
})

app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message })
    } else next(err)
})

app.use((err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23502') {
        res.status(400).send({ message: 'Bad request' })
    } else if (err.code === '23503') {
        res.status(404).send({ message: 'Not found' })
    } else next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({ message: "Internal Server Error" })
})


module.exports = app