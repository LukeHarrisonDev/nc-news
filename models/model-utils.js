const db = require("../db/connection");
const format = require("pg-format")

function checkExists(table, column, value) {
    if(!table, !column, !value) {
        return false
    }
    let sqlString =
    `SELECT * FROM %I
    WHERE %I = %L`
    const formattedString = format(sqlString, table, column, value)
    return db.query(formattedString)
    .then(({rows}) => {
        if(rows.length === 0) {
            return false
        }
        return true
    })
}

// // in utils.js
// const format = require("pg-format");
// const checkExists = async (table, column, value) => {
//   const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
//   const dbOutput = await db.query(queryStr, [value]);
//   if (dbOutput.rows.length === 0) {
//     // resource does NOT exist
//     return Promise.reject({ status: 404, msg: "Resource not found" });
//   }
// };

module.exports = { checkExists };
