const db = require("../db/connection")

function fetchArticleById(articleId) {
    let sqlString = 
    `SELECT * FROM articles
    WHERE article_id = $1`
    return db.query(sqlString, [articleId])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status:404, message: "Not found"})
        }
        return rows[0]
    })
}

function fetchArticles(sortBy = 'created_at', order = "desc") {

    const greenList = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"]

    if(! greenList.includes(sortBy)){
        return Promise.reject({status:400, message: "Bad request"})
    }

    let sqlString = 
    `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id `

    if(sortBy) {
        sqlString += `ORDER BY ${sortBy} ` 
        if(order === "asc") {
            sqlString +=`ASC`
        } else if (order === "desc") {
            sqlString += `DESC`
        } else if (order) {
            return Promise.reject({status:400, message: "Bad request"})
        }
    }
    
    return db.query(sqlString)
    .then(({rows}) => {
        return rows
    })
}

function updateArticleById(articleId, votes) {
    if (typeof votes !== 'number') {
        return Promise.reject({status:400, message: "Bad request"})
    }
    return db.query(
        `SELECT votes
        FROM articles
        WHERE article_id = $1;`, [articleId])
    .then(({rows}) => {
        let currentVotes = rows[0].votes
        let totalVotes = currentVotes += votes
        if (totalVotes < 0) {
            totalVotes = 0
        }
        const votesAndId = [totalVotes, articleId]
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