const { getArticleById, getArticles } = require("./controllers/articles.controllers")
const { getComments, postComment } = require("./controllers/comments.controllers")
const { getTopics } = require("./controllers/topics.controllers")
const endpoints = require("./endpoints.json")
const {
    catchInvalidEndpoints,
    badRequestError,
    notFoundError,
    customError,
    catchAllErrors} = require("./error-handling")

const express = require("express")
const app = express()
app.use(express.json())

app.get("/api", (request, response) => {
    response.status(200).send({endpoints})
})

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getComments)
app.post("/api/articles/:article_id/comments", postComment)

app.all("/*", catchInvalidEndpoints)

//Error Handling
app.use(badRequestError)

app.use(notFoundError)

app.use(customError)

app.use(catchAllErrors)

module.exports = app