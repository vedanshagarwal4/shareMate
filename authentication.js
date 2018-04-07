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
	let que=`create table main (name varchar(20),roll varchar(8), email varchar(30), password varchar(200), phone float(10,0), hostel varchar(25), room varchar(5))`;
		con.query(que,function(qerr,qres){
			if(qerr)
			{
				console.log(qerr);
			}
		});
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