const catchInvalidEndpoints = (request, response) => {
    response.status(404).send({ message: "Not found" });
};

const badRequestError = (error, request, response, next) => {
    if (
        error.code === "23502" ||
        error.code === "22P02") {
        response.status(400).send({ message: "Bad request" });
    }
    next(error);
};

const notFoundError = (error, request, response, next) => {
    if (error.code === "22003" || error.code === "23503") {
        response.status(404).send({ message: "Not found" });
    }
    next(error);
};

const customError = (error, request, response, next) => {
    if (error.status && error.message) {
        response.status(error.status).send({ message: error.message });
    }
    next(error);
};

const catchAllErrors = (error, request, response, next) => {
    response.status(500).send({ message: "Internal server error" });
    next(error);
};

module.exports = {
    catchInvalidEndpoints,
    badRequestError,
    notFoundError,
    customError,
    catchAllErrors,
};
