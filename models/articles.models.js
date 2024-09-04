const db = require("../db/connection");
const { checkExists } = require("./model-utils");

function fetchArticles(sortBy = "created_at", order = "desc", topic) {
    let topicExists = [];

    const greenList = [
        "author",
        "title",
        "article_id",
        "topic",
        "created_at",
        "votes",
        "article_img_url",
        "comment_count",
    ];

    if (!greenList.includes(sortBy)) {
        return Promise.reject({ status: 400, message: "Bad request" });
    }
    const queryValues = [];
    let sqlString = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id `;

    if (topic) {
        return checkExists("topics", "slug", topic)
        .then((result) => {
            if (result === false) {
                return Promise.reject({ status: 400, message: "Bad request" });
            } else {
                sqlString += `WHERE topic = $1 `;
                queryValues.push(topic);

                sqlString += `GROUP BY articles.article_id `;

                if (sortBy) {
                    sqlString += `ORDER BY ${sortBy} `;
                    if (order === "asc") {
                        sqlString += `ASC`;
                    } else if (order === "desc") {
                        sqlString += `DESC`;
                    } else if (order) {
                        return Promise.reject({
                            status: 400,
                            message: "Bad request",
                        });
                    }
                }

                return db.query(sqlString, queryValues).then(({ rows }) => {
                    return rows;
                });
            }
        });
    } else {
        sqlString += `GROUP BY articles.article_id `;

        if (sortBy) {
            sqlString += `ORDER BY ${sortBy} `;
            if (order === "asc") {
                sqlString += `ASC`;
            } else if (order === "desc") {
                sqlString += `DESC`;
            } else if (order) {
                return Promise.reject({ status: 400, message: "Bad request" });
            }
        }

        return db.query(sqlString, queryValues).then(({ rows }) => {
            return rows;
        });
    }
}

function addArticle(newArticle) {
    if (Object.keys(newArticle).length <= 3 || newArticle.body.length === 0 || newArticle.title.length === 0) {
        return Promise.reject({ status: 400, message: "Bad request" })
    }
    return checkExists("topics", "slug", newArticle.topic)
    .then((result) => {
        if (result === false) {
            return Promise.reject({ status: 400, message: "Bad request" })
        } else {
            let sqlString =
            `INSERT INTO articles (author, title, body, topic)
            VALUES ($1, $2, $3, $4) 
            RETURNING *`
            const values = [
                newArticle.author,
                newArticle.title,
                newArticle.body,
                newArticle.topic,
            ]
            return db.query(sqlString, values).then(({ rows }) => {
                let article = rows
                let sqlString2 = 
                `SELECT COUNT(article_id) AS comment_count FROM comments WHERE article_id = ${rows[0].article_id}`
                return db.query(sqlString2).then(({rows}) => {
                    // console.log(rows, "<<<< ")
                    article[0].comment_count = rows[0].comment_count
                    return article[0]
                })
            })
        }
    })
}

function fetchArticleById(articleId) {
    let sqlString =
    `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`;

    return db.query(sqlString, [articleId]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Not found" });
        }
        return rows[0];
    });
}

function updateArticleById(articleId, votes) {
    if (typeof votes !== "number") {
        return Promise.reject({ status: 400, message: "Bad request" });
    }
    const sqlString = `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`;

    return db.query(sqlString, [votes, articleId]).then(({ rows }) => {
        if (rows[0].votes < 0) {
            rows[0].votes = 0;
        }
        return rows[0];
    });
}

module.exports = { fetchArticleById, fetchArticles, updateArticleById, addArticle };
