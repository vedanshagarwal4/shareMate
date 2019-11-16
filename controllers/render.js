
var con = require('../config');

exports.head=function(req,res){
	if(req.session && req.session.user){
		var rworks={};
		let que = `select * from requests order by id desc`;
		con.query(que,(err,results,fields) => {
				if(err){
					throw(err);
				}
				else{
				rworks = results;
			}
			res.render('request',{
			currentUser:req.session.user.roll,
			works:rworks
			 });
			// console.log(rworks[0]);
		    
			});
		
  }
  else{
		req.session.destroy();
		res.redirect('/');
	}
}

exports.acceptedRequests = function(req,res){
	if(req.session && req.session.user){
	var roll = req.session.user.roll;
	var aworks = {} ;
	que = `select * from accepted where generator = '${roll}'`;
	
	con.query(que,function(err,results,fields){
				if(err)
				throw err;
                aworks = results;
       res.render('accepted',{
		works:aworks,
		currentUser: req.session.user.roll
		
	});
		});

}
else{
		req.session.destroy();
		res.redirect('/');
	}
}
exports.leaderboard=function(req,res){
	if(req.session && req.session.user){
		let que=`select * from main order by points desc`;
		con.query(que,function(err,results,fields){
			if(err){
				console.log(err);
			}
			res.render('leaderboard',{
				board:results,
				currentUser:req.session.user.roll

			});

		});
	}
	else{
		res.redirect('/request');
	}	
}	