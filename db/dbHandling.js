var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '121233',
    database: 'comunix_assignment'
});

async function add(tableName, params) {
    connection.connect();
    return new Promise((resolve, reject) => {
        connection.query(generateSql("SELECT", fields, tableName, params), function (error, results, fields) {
            connection.end();
            if (error) {
                reject(error)
            }
            resolve(results[0])
        })
    })
}

async function fetch(tableName, params, fields) {
    connection.connect();
    console.log("sql is: " + generateSql("SELECT", fields, tableName, params))
    return new Promise((resolve, reject) => {
        connection.query(generateSql("SELECT", fields, tableName, params), function (error, results, fields) {
            connection.end();
            if (error) {
                reject(error)
            }
            resolve(results)
        })
    })
}

exports.fetch = fetch

// async function main() {
//     const tt = await fetch('users', { Uemail: "rarzip50@gmail.com" })
// }

// main()

function generateSql(method, fields, tables, params) {
    const sql = `${method} ?? FROM ?? WHERE ?`;
    const inserts = [fields, tables, params];
    return mysql.format(sql, inserts);
}