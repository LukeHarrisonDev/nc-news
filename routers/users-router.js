const { getUsers, getUserByUserName } = require("../controllers/users.controllers");

const usersRouter = require("express").Router()

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUserByUserName)

module.exports = usersRouter