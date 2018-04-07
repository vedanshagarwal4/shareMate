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

