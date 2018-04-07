const express = require('express');
const Authentication = require('./authentication');
const appRouter = express.Router();
appRouter.get("/",(req,res)=>{
	res.render("index");

});
appRouter.get("/signup",(req,res)=>{
	res.render("signup");
});
appRouter.get("/login",(req,res)=>{
	res.render("login");
});
appRouter.post("/new",Authentication.signup);
appRouter.post("/old",Authentication.login);
appRouter.get("/request",(req,res)=>{
	res.render("request");
});
appRouter.get('/logout',Authentication.logout);
appRouter.get('/log',(req,res) => {
	res.redirect('/');
});
module.exports = appRouter;