const db = require("../db/connection")
const format = require("pg-format")

function fetchComments(id) {
    let sqlString = 
    `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`
    return db.query(sqlString, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status:404, message: "Not found"})
        }
        return rows
    })
}

function insertComment(newComment, article_id) {
    if (Object.keys(newComment).length === 0 || newComment.body.length === 0) {
        return Promise.reject({status:400, message: "Bad request"})
    }
    let sqlString =
    `INSERT INTO comments (author, body, article_id)
    VALUES %L
    RETURNING *`

    const formattedValues = [[newComment.username, newComment.body, article_id.article_id]]

    const queryString = format(sqlString, formattedValues)
    return db.query(queryString)
    .then (({rows}) => {
        return rows[0]
    })
}
module.exports = {fetchComments, insertComment}