const { fetchArticleById, fetchArticles } = require("../models/articles.models")

function getArticleById(request, response, next) {
    const id = request.params.article_id
    fetchArticleById(id)
    .then((article) => {
        response.status(200).send({article})
    })
    .catch((error) => {
        next(error)
    })
}

function getArticles(request, response, next) {
    fetchArticles()
    .then((articles) => {
        response.status(200).send({articles})
    })
}

module.exports = {getArticleById, getArticles}