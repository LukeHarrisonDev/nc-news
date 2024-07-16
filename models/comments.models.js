const db = require("../db/connection")

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

module.exports = {fetchComments}