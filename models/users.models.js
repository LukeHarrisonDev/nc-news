const db = require("../db/connection");

function fetchUsers() {
    let sqlString = `SELECT * FROM users`;
    return db.query(sqlString).then(({ rows }) => {
        return rows;
    });
}

module.exports = { fetchUsers };
