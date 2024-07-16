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
    `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC`
    
    return db.query(sqlString)
    .then(({rows}) => {
        return rows
    })
}

module.exports = {fetchArticleById, fetchArticles}