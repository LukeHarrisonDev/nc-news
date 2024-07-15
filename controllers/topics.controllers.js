const { fetchTopics } = require("../models/topics.models")

function getTopics(request, response, next) {
    fetchTopics()
    .then(({rows}) => {
        const topics = rows
        response.status(200).send({topics})
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = {getTopics}