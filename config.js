const mysql = require('mysql');

const con = mysql.createConnection({
	host : "localhost",
	user : "root",
	password : "04111998",
	database : "shareMate"
});

module.exports = con;