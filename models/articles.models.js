const db = require("../db/connection")

function fetchArticleById(id) {
    let sqlString = 
    `SELECT * FROM articles
    WHERE article_id = $1`
    return db.query(sqlString, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status:404, message: "Not found"})
        }
        return rows[0]
    })
}

function fetchArticles() {
    let sqlString = 
    `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles
    ORDER BY created_at DESC`

    return db.query(sqlString)
    .then(({rows}) => {
        return rows
    })
}

module.exports = {fetchArticleById, fetchArticles}