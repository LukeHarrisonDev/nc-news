const db = require("../db/connection");

function checkTopicExists(topic) {
    const sqlString = `SELECT * FROM topics WHERE slug = $1`;
    return db.query(sqlString, [topic]).then(({ rows }) => {
        if (rows.length === 0) {
            return false;
        }
        return true;
    });
}

module.exports = { checkTopicExists };
