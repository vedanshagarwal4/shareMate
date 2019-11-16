
const express = require('express');
const Authentication = require('./authentication');
const appRouter = express.Router();
const profileRouter = express.Router();
const acceptRouter = express.Router();
const feedRouter = express.Router();
const Render = require('./controllers/render');
appRouter.get("/",(req,res)=>{
	res.render("index1");

});
appRouter.get("/signup",(req,res)=>{
	res.render("signup");
});
appRouter.get("/login",(req,res)=>{
	res.render("login");
});
appRouter.post("/new",Authentication.signup);
appRouter.post("/old",Authentication.login);
appRouter.get("/request",Render.head);
appRouter.get('/logout',Authentication.logout);
appRouter.get('/log',(req,res) => {
	res.redirect('/');
});
appRouter.get('/invite',Authentication.invite);
// appRouter.get('/emailVal',Authentication.emailVal);
appRouter.post('/addrequest',Authentication.request);
appRouter.post('/acceptrequest',Authentication.acceptrequest);
appRouter.post('/deleterequest',Authentication.deleterequest);
appRouter.use('/profile',profileRouter);
profileRouter.use(express.static(__dirname + '/public'));
profileRouter.get('/:currentUser',Authentication.profile);
appRouter.use('/accepted',acceptRouter);
acceptRouter.use(express.static(__dirname + '/public'));
acceptRouter.get('/:currentUser',Render.acceptedRequests);
appRouter.post('/reopen',Authentication.reopen);
appRouter.post('/close',Authentication.close);
appRouter.get('/leaderboard',Render.leaderboard);

appRouter.use('/feedback',feedRouter);
feedRouter.use(express.static(__dirname + '/public'));
feedRouter.get('/:roll',Authentication.feedback);
module.exports = appRouter;