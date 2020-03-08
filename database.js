require('dotenv').config();
// get the client
const mysql = require('mysql2');
const { HOST, DATABASE, PASSWORD } = process.env;
// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
	host: HOST,
	user: 'admin',
	database: DATABASE,
	password: PASSWORD,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

module.exports = pool;
