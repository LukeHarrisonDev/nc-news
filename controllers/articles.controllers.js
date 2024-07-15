const { fetchArticleById } = require("../models/articles.models")


function getArticleById(request, response, next) {
    const id = request.params.article_id
    fetchArticleById(id)
    .then(({rows}) => {
        const article = rows
        response.status(200).send({article})
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = {getArticleById}