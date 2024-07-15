const db = require("../db/connection")

function fetchArticleById(id) {
    let sqlString = 
    `SELECT * FROM articles
    WHERE article_id = $1`
    return db.query(sqlString, [id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status:404, message: "Not found"})
        }
        return result

    })

}

module.exports = {fetchArticleById}