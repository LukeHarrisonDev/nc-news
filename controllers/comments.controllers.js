const { fetchComments, insertComment } = require("../models/comments.models")

function getComments(request, response, next) {
    const id = request.params.article_id
    fetchComments(id)
    .then((comments) => {
        response.status(200).send({comments})
    })
    .catch((error) => {
        next(error)
    })
}

function postComment(request, response, next) {
    const newComment = request.body
    const articleId = request.params
    insertComment(newComment, articleId)
    .then((comment) => {
        response.status(201).send({comment})
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = {getComments, postComment}