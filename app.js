const { getTopics } = require("./controllers/topics.controllers")
const endpoints = require("./endpoints.json")

const express = require("express")
const app = express()

app.get("/api", (request, response) => {
    response.status(200).send({endpoints})
})

app.get("/api/topics", getTopics)

app.use((error, request, response, next) => {
    response.status(500).send({message: "Internal Server Error"})
    next(error)
})

module.exports = app