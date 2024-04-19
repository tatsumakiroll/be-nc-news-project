const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router')

app.use(express.json())

app.use('/api', apiRouter)


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