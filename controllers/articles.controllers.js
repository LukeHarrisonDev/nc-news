const { sort } = require("../db/data/test-data/articles");
const {
    fetchArticleById,
    fetchArticles,
    updateArticleById,
    addArticle,
} = require("../models/articles.models");

function getArticles(request, response, next) {
    const sort_by = request.query.sort_by;
    const order = request.query.order;
    const topic = request.query.topic;
    const limit = request.query.limit;
    fetchArticles(sort_by, order, topic, limit)
        .then((articles) => {
            response.status(200).send({ articles });
        })
        .catch((error) => {
            next(error);
        });
}

function postArticle(request, response, next) {
    const newArticle = request.body
    addArticle(newArticle)
    .then((article) => {
        response.status(201).send({ article })
    })
    .catch((error) => {
        next(error)
    })
}

function getArticleById(request, response, next) {
    const article_id = request.params.article_id;
    fetchArticleById(article_id)
        .then((article) => {
            response.status(200).send({ article });
        })
        .catch((error) => {
            next(error);
        });
}

function patchArticleById(request, response, next) {
    const article_id = request.params.article_id;
    const votes = request.body.inc_votes;
    updateArticleById(article_id, votes)
        .then((article) => {
            response.status(200).send({ article });
        })
        .catch((error) => {
            next(error);
        });
}

module.exports = { getArticleById, getArticles, patchArticleById, postArticle };
