const { sort } = require("../db/data/test-data/articles");
const {
    fetchArticleById,
    fetchArticles,
    updateArticleById,
} = require("../models/articles.models");

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

function getArticles(request, response, next) {
    const sort_by = request.query.sort_by;
    const order = request.query.order;
    const topic = request.query.topic;
    fetchArticles(sort_by, order, topic)
        .then((articles) => {
            response.status(200).send({ articles });
        })
        .catch((error) => {
            // console.log("><><><><><><><<<<<<<<<<<<<<<<<<<<")
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

module.exports = { getArticleById, getArticles, patchArticleById };
