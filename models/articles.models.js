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

function updateArticleById(id, votes) {
    if (typeof votes !== 'number') {
        return Promise.reject({status:400, message: "Bad request"})
    }
    return db.query(
        `SELECT votes
        FROM articles
        WHERE article_id = $1;`, [id])
    .then(({rows}) => {
        let currentVotes = rows[0].votes
        let totalVotes = currentVotes += votes
        if (totalVotes < 0) {
            totalVotes = 0
        }
        const votesAndId = [totalVotes, id]
        let sqlString = 
        `UPDATE articles
        SET votes = $1
        WHERE article_id = $2
        RETURNING *`
        return db.query(sqlString, votesAndId)
        .then(({rows}) => {
            return rows[0]
        })
    })
}

module.exports = {fetchArticleById, fetchArticles, updateArticleById}