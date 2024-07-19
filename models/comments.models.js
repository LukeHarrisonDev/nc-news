const db = require("../db/connection");

function fetchComments(id) {
    let sqlString = `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`;
    return db.query(sqlString, [id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Not found" });
        }
        return rows;
    });
}

function insertComment(newComment, article_id) {
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

module.exports = { fetchComments, insertComment, removeComment };
