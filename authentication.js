const con = require('./config');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

exports.signup = function(req,res)
{
	var name=req.body.name;
	var roll=req.body.roll;
	var email=req.body.email;
	var password=req.body.password;
	var phone=req.body.phone;
	var hostel=req.body.hostel;
	var room=req.body.room;
	var user={
	    name:req.body.name,
		email:req.body.email,
		roll:req.body.roll
	};
	// let que=`create table main (name varchar(20),roll varchar(20), email varchar(30), password varchar(200), phone float(10,0), hostel varchar(25),room varchar(20))`;
	// 	con.query(que,function(qerr,qres){
	// 		if(qerr)
	// 		{
	// 			console.log(qerr);
	// 		}
	// 	});
	const SALT_FACTOR = 5;
	bcrypt.genSalt(SALT_FACTOR,function(serr,salt){
		if(serr){
		    console.log(serr);
		}
		bcrypt.hash(password,salt,function(herr,hash){
			if(herr){
	    		console.log(herr);
			}

		

		que = `insert into main (name,roll,email,password,phone,hostel,room) values('${name}','${roll}','${email}','${hash}','${phone}','${hostel}','${room}')`;

		con.query(que,function(qerr,qres){
			if(qerr)
			{
				console.log(qerr);
			}
		req.session.user = user;
		res.redirect("/request");
		});
	});

	});

}
exports.login= function(req,res){
	var email= req.body.email;
	var password =  req.body.password;
	var user = {
		email:req.body.email
	}
	var que=`SELECT * FROM  main WHERE email = ?`;
	con.query(que,[email], function (error, results, fields) {
	if (error) {
	    console.log(error);
	}
	else{
		if(results.length >0){
			  bcrypt.compare(password, results[0].password, function(err, doesMatch){
				if (doesMatch){
					user.name = results[0].name;
					req.session.user = user;
				}
				else{
					res.redirect('/login?err=Enter valid Password');
				}
			});
		}
		else{
			res.redirect('/login?err=Enter valid Email');
		}
	}
	console.log("Success");
	res.redirect("/request");
	});
}

exports.logout=function(req,res){
	req.session.destroy();
	// console.log(req.session);
	res.redirect('/log');
	// console.log('Logged out');

}