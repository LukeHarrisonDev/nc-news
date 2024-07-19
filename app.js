const {
    getArticleById,
    getArticles,
    patchArticleById,
} = require("./controllers/articles.controllers");
const {
    getComments,
    postComment,
    deleteComment,
} = require("./controllers/comments.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");
const endpoints = require("./endpoints.json");
const {
    catchInvalidEndpoints,
    badRequestError,
    notFoundError,
    customError,
    catchAllErrors,
} = require("./error-handling");

const express = require("express");
const app = express();
app.use(express.json());

app.get("/api", (request, response) => {
    response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", catchInvalidEndpoints);

//Error Handling
app.use(badRequestError);
app.use(notFoundError);
app.use(customError);
app.use(catchAllErrors);
module.exports = app;