const mysql = require('mysql');

const con = mysql.createConnection({
	host : "localhost",
	user : "root",
	password : "computer",
	database : "shareMate"
});

module.exports = con;