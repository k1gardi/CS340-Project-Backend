let mysql = require('mysql');
let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_gardik',
    password: 'XXXX',
    database: 'cs340_gardik'
})

module.exports.pool = pool;