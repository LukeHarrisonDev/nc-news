const db = require("../db/connection")

function fetchUsers() {
    let sqlString = `SELECT * FROM users`
    return db.query(sqlString)
    .then(({ rows }) => {
        return rows;
    });
}

function fetchUserByUsername(username) {
    let sqlString = 
    `SELECT * FROM users
    WHERE username = $1`
    return db.query(sqlString, [username])
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, message: "Not found"})
        }
        return rows[0]
    })
}

module.exports = { fetchUsers, fetchUserByUsername }
