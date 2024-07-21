const apiRouter = require("express").Router()
const articlesRouter = require("./articles-router")
const usersRouter = require("./users-router")
const commentsRouter = require("./comments-router")

const { getTopics } = require("../controllers/topics.controllers")

const endpoints = require("../endpoints.json")

apiRouter.get("/", (request, response) => {
    response.status(200).send({ endpoints })
});

apiRouter.use("/articles", articlesRouter)

apiRouter.get("/topics", getTopics)

apiRouter.use("/users", usersRouter)

apiRouter.use("/comments", commentsRouter)

module.exports = apiRouter