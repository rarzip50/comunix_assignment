var mysql = require('mysql');
const utils = require('./utils')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '121233',
    database: 'comunix_assignment'
});

exports.update = async function (tableName, data, predicate) {
    const command = utils.update(tableName, data, predicate)
    return new Promise((resolve, reject) => {
        connection.query(command, function (error, results, fields) {
            if (error) {
                reject(error)
                console.log(error)
            } else {
                resolve(results)
                console.log("updating data, sql is: " + command)
                console.log(`Data updated successfully`)
            }
            console.log("_____________________________________")
        })
    })
}

exports.add = async function (tableName, data) {
    const command = utils.add(tableName, data)
    return new Promise((resolve, reject) => {
        connection.query(command, function (error, results, fields) {
            if (error) {
                reject(error)
                console.log(error)
            } else {
                resolve(results)
                console.log("adding data, sql is: " + command)
                console.log(`Data added successfully`)
            }
            console.log("_____________________________________")
        })
    })
}

async function fetch(tableName, predicate) {
    const command = utils.get(tableName, predicate)
    return new Promise((resolve, reject) => {
        connection.query(command, function (error, results, fields) {
            if (error) {
                reject(error)
                console.log(error)
            }
            resolve(results)
            console.log("fetching data, sql is: " + command)
            console.log(`Data returned from db is: ${JSON.stringify(results, undefined, 2)}`)
            console.log("_____________________________________")
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



