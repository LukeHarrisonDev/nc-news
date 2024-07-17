const { fetchArticleById, fetchArticles, updateArticleById } = require("../models/articles.models")

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
    .catch((error) => {
        next(error)
    })
}

function patchArticleById(request, response, next) {
    const id = request.params.article_id
    const votes = request.body.inc_votes
    updateArticleById(id, votes)
    .then((article) => {
        response.status(200).send({article})
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = {getArticleById, getArticles, patchArticleById}