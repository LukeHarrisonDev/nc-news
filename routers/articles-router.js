const { getArticleById, getArticles, patchArticleById, postArticle } = require("../controllers/articles.controllers")
const { getComments, postComment } = require("../controllers/comments.controllers")

const articlesRouter = require("express").Router()

articlesRouter.get("/", getArticles)
articlesRouter.post("/", postArticle)

articlesRouter.get("/:article_id", getArticleById)
articlesRouter.patch("/:article_id", patchArticleById)

articlesRouter.get("/:article_id/comments", getComments)
articlesRouter.post("/:article_id/comments", postComment)

module.exports = articlesRouter