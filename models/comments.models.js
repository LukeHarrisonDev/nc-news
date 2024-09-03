const db = require("../db/connection");
const { checkExists } = require("./model-utils");

function fetchComments(articleId) {
    let sqlString = `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`;
    return db.query(sqlString, [articleId])
    .then(({ rows }) => {
        return checkExists("articles", "article_id", articleId)
        .then((result) => {
            if(result === false) {
                return Promise.reject({ status: 404, message: "Not found" });
            }
            return rows;
        })
    });
}

function addComment(newComment, article_id) {
    if (Object.keys(newComment).length <= 1 || newComment.body.length === 0) {
        return Promise.reject({ status: 400, message: "Bad request" });
    }
    let sqlString = `INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *`;

    const values = [
        newComment.username,
        newComment.body,
        article_id.article_id,
    ];
    return db.query(sqlString, values).then(({ rows }) => {
        return rows[0];
    });
}

function updateComment(commentId, votes) {
    if (typeof votes !== "number") {
        return Promise.reject({ status: 400, message: "Bad request" });
    }
    let sqlString =
    `UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *`
    return db.query(sqlString, [votes, commentId])
    .then(({rows}) => {
        if(rows[0].votes < 0) {
            rows[0].votes = 0
        }
        return rows[0]
    })
}

function removeComment(articleId) {
    let sqlString = `DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *`;
    return db.query(sqlString, [articleId]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Not found" });
        }
    });
}

module.exports = { fetchComments, addComment, removeComment, updateComment };
