const { fetchUsers, fetchUserByUsername } = require("../models/users.models");

function getUsers(request, response, next) {
    fetchUsers()
    .then((users) => {
        response.status(200).send({ users });
    })
    .catch((error) => {
        next(error);
    });
}

function getUserByUserName(request, response, next) {
    const username = request.params.username
    fetchUserByUsername(username)
    .then((user) => {
        response.status(200).send({ user })
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = { getUsers, getUserByUserName }