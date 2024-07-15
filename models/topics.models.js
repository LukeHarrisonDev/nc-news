const db = require("../db/connection")

function fetchTopics() {
    let sqlString = `SELECT * FROM topics`
    return db.query(sqlString)
}

module.exports = {fetchTopics}