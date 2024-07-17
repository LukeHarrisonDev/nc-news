const { fetchComments, insertComment, removeComment } = require("../models/comments.models")

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

function deleteComment(request, response, next) {
    const commentId = request.params.comment_id
    removeComment(commentId)
    .then(() => {
        response.status(204).send()
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = {getComments, postComment, deleteComment}