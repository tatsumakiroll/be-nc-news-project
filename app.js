const express = require('express');
const app = express();
const { getApi, getAllTopics } = require('./controllers/topics.controllers')

app.use(express.json());

app.get("/api", getApi)

app.get("/api/topics", getAllTopics)

app.all('*', (req, res, next)=>{
        res.status(404).send({message: 'not found'}) 
})

app.use((err, req, res, next) => {
    res.status(500).send({ message: "internal server error" })
  })
  
 

module.exports = app