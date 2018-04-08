
const con = require('./config');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mailer = require('nodemailer');

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

		

		que = `insert into main (name,roll,email,password,phone,hostel,room,points) values('${name}','${roll}','${email}','${hash}','${phone}','${hostel}','${room}',0)`;

		con.query(que,function(qerr,qres){
			if(qerr)
			{
				console.log(qerr);
			}
		req.session.user = user;
		res.redirect('/request');
	});

	});
});
}
exports.login= function(req,res){
	var roll = req.body.roll;
	var email= req.body.email;
	var password =  req.body.password;
	var user = {
		email:req.body.email,
		roll:req.body.roll
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
					// user.roll = results[0].roll;
					
				}
				else{
					res.redirect('/login?err=Enter valid Password');
				}
			});
		}
		else{
			res.redirect('/login?err=Enter valid Email');
		}
		req.session.user = user;
	console.log("Success");
	res.redirect('request')
	
	// console.log(currentUser);

}
});
}

exports.logout=function(req,res){
	req.session.destroy();
	// console.log(req.session);
	res.redirect('/log');
	// console.log('Logged out');

}
exports.request=function(req,res){
	var description = req.body.description;
	var roll = req.session.user.roll;
	que  = `insert into requests (roll, description) values('${roll}','${description}')`;
	con.query(que,function(qerr,qres){
		if(qerr){
			console.log(qerr);
		}
	});
	res.redirect('/request');
}
exports.profile = function(req,res){
	if(req.session && req.session.user){
		var roll = req.params.currentUser;
		// console.log(roll);
		let que= `select * from main where roll = '${roll}'`;
		con.query(que,function(err,results,fields){
			if(err)
			throw err;
			res.render('profile',{
			    name:results[0].name,
				roll:results[0].roll,
				email:results[0].email,
				phone:results[0].phone,
				hostel:results[0].hostel,
				room:results[0].room,
				points:results[0].points
			});
		});
	}
}
exports.deleterequest = function(req,res){
	var id =req.body.deletevalue;
	var roll = req.session.user.roll;
	let que = `delete from requests where roll ='${roll}' and id='${id}'`;
	con.query(que,function(err,results,fields){
			if(err)
			throw err;
	});
	res.redirect('/request');
}
exports.acceptrequest =function(req,res){
	var id = req.body.acceptvalue;
	var or_roll=req.body.original;
	var acceptor = req.session.user.roll;
	if(or_roll!=acceptor){
	let que =`select * from requests where id ='${id}'`;
     con.query(que,function(err,results,fields){
			if(err)
			throw err;
		var generator = results[0].roll;
		var description = results[0].description;
		que = `insert into accepted (acceptor,id,generator,description) values ('${acceptor}','${id}','${generator}','${description}')`;
		con.query(que,function(err,results,fields){
				if(err)
				throw err;
		});
		que = `delete from requests where id='${id}'`;
		con.query(que,function(err,results,fields){
				if(err)
				throw err;
		});
		
		// alert('Cannot accept your own request');
		res.redirect('/request');

	});
	
   }
   else{
   	res.redirect('/request');
   }

}
exports.reopen=function(req,res){
	var id = req.body.accvalue;

	que = `select * from accepted where id ='${id}'`;
	con.query(que,function(err,results,fields){
				if(err)
				throw err;
			var roll = results[0].generator;
			var description =results[0].description;
			que = `insert into requests (id ,roll ,description) values('${id}','${roll}','${description}')`;
			con.query(que,function(err,results,fields){
				if(err)
				throw err;
					que = `delete from accepted where id='${id}'`;
			     	con.query(que,function(err,results,fields){
						if(err)
						throw err;
				     });
		res.redirect('/accepted/'+roll);
		});
			
		});
}
exports.close = function(req,res){
	var id = req.body.delvalue;
	let que =`select * from accepted where id='${id}'`;
    con.query(que,function(err,results,fields){
		if(err)
		throw err;
	    var roll = results[0].acceptor;
	    que= `update main set points = points+2 where roll = '${roll}'`;
	    con.query(que,function(err,results,fields){
		    if(err)
		    throw err;
        });
    });
    que =`delete from accepted where id='${id}'`;
    con.query(que,function(err,results,fields){
		    if(err)
		    throw err;
        });
    res.redirect('/request');
		
}
exports.invite = function(req,res){
	var sender = mailer.createTransport({
		service : 'gmail',
		auth: {
			user: 'abhijeetmathur786@gmail.com',
			pass: 'Anujay786@'
		},
		tls: {
        	rejectUnauthorized: false
    	}
	});
	// let que=`select email from main`;
	
var maillist = [
  'vedanshagarwal4@gmail.com',
  'noelabydas@gmail.com'
];

maillist.forEach(function (to, i , array) {

var mail = {
		from : 'abhijeetmathur786@gmail.com',
		// to : req.body.email,
		subject : `Invitation to see requests`,
		text : `Your have a new invitation`
	};

  mail.to = to;
  sender.sendMail(mail, function (err) {
    if (err) { 
      console.log('Sending to ' + to + ' failed: ' + err);
      return;
    } else { 
      console.log('Sent to ' + to);
    }

    if (i === maillist.length - 1) { mail.transport.close(); }
  });
});

}