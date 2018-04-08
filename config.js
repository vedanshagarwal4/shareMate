const mysql = require('mysql');

const con = mysql.createConnection({
	host : "localhost",
	user : "root",
	password : "Anujay786",
	database : "shareMate"
});

module.exports = con;