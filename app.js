const { getArticleById, getArticles } = require("./controllers/articles.controllers")
const { getTopics } = require("./controllers/topics.controllers")
const endpoints = require("./endpoints.json")

const express = require("express")
const app = express()

app.get("/api", (request, response) => {
    response.status(200).send({endpoints})
})

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get ("/api/articles/:article_id", getArticleById)


//Error Handling
app.use((error, request, response, next) => {
    if(error.code === "22P02") {
        response.status(400).send({message: "Bad request"})
    }
    next(error)
})

app.use((error, request, response, next) => {
    if(error.code === "22003") {
        response.status(404).send({message: "Not found"})
    }
    next(error)
})

app.use((error, request, response, next) => {
    if(error.status && error.message) {
        response.status(error.status).send({message: error.message})
    }
    next(error)
})

app.use((error, request, response, next) => {
    response.status(500).send({message: "Internal server error"})
    next(error)
})

module.exports = app