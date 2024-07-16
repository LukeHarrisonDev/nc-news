const { getArticleById, getArticles } = require("./controllers/articles.controllers")
const { getComments } = require("./controllers/comments.controllers")
const { getTopics } = require("./controllers/topics.controllers")
const endpoints = require("./endpoints.json")
const {
    catchInvalidEndpoints,
    invalidDataTypeError,
    outOfRangeError,
    customError,
    catchAllErrors} = require("./error-handling")

const express = require("express")
const app = express()

app.get("/api", (request, response) => {
    response.status(200).send({endpoints})
})

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getComments)

app.all("/*", catchInvalidEndpoints)


//Error Handling
app.use(invalidDataTypeError)

app.use(outOfRangeError)

app.use(customError)

app.use(catchAllErrors)

module.exports = app