const { fetchTopics } = require("../models/topics.models")

function getTopics(request, response, next) {
    fetchTopics()
    .then(({rows}) => {
        // console.log(rows, "<< Rows")
        const topics = rows
        response.status(200).send({topics})
    })
    .catch((error) => {
        console.log(error, "<<< Err in Controller")
        next(error)
    })
}

module.exports = {getTopics}