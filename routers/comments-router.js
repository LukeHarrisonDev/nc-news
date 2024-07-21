const { patchComment, deleteComment } = require("../controllers/comments.controllers")

const commentsRouter = require("express").Router()

commentsRouter.patch("/:comment_id", patchComment)
commentsRouter.delete("/:comment_id", deleteComment)

module.exports = commentsRouter