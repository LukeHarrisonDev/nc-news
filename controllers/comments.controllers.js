const { fetchComments } = require("../models/comments.models")

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

module.exports = {getComments}