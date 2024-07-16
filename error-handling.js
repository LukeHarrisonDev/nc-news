const catchInvalidEndpoints = (request, response) => {
    response.status(404).send({message: "Not found"})
}

const invalidDataTypeError = (error, request, response, next) => {
    if(error.code === "22P02") {
        response.status(400).send({message: "Bad request"})
    }
    next(error)
}

const outOfRangeError = (error, request, response, next) => {
    if(error.code === "22003") {
        response.status(404).send({message: "Not found"})
    }
    next(error)
}

const customError = (error, request, response, next) => {
    if(error.status && error.message) {
        response.status(error.status).send({message: error.message})
    }
    next(error)
}

const catchAllErrors = (error, request, response, next) => {
    response.status(500).send({message: "Internal server error"})
    next(error)
}

module.exports = {
    catchInvalidEndpoints,
    invalidDataTypeError,
    outOfRangeError,
    customError,
    catchAllErrors
}