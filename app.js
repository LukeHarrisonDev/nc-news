
const {
    catchInvalidEndpoints,
    badRequestError,
    notFoundError,
    customError,
    catchAllErrors,
} = require("./error-handling");
const apiRouter = require("./routers/api-router");

const express = require("express");
const app = express();
app.use(express.json());

app.use("/api", apiRouter);

//Error Handling
app.all("/*", catchInvalidEndpoints);
app.use(badRequestError);
app.use(notFoundError);
app.use(customError);
app.use(catchAllErrors);
module.exports = app;