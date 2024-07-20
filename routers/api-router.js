const apiRouter = require("express").Router()
const articlesRouter = require("./articles-router")
const usersRouter = require("./users-router")

const { deleteComment } = require("../controllers/comments.controllers")
const { getTopics } = require("../controllers/topics.controllers")

const endpoints = require("../endpoints.json")

apiRouter.get("/", (request, response) => {
    response.status(200).send({ endpoints })
});

apiRouter.use("/articles", articlesRouter)

apiRouter.get("/topics", getTopics)

apiRouter.use("/users", usersRouter)

apiRouter.delete("/comments/:comment_id", deleteComment)

module.exports = apiRouter