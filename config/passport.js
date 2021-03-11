const LocalStrategy = require("passport-local").Strategy,
	  mongoose = require("mongoose"),
	  bcrypt = require("bcryptjs"),
	  User = require("../models/User");

//Export Strategy
module.exports = function(passport){
	passport.use('local',
	new LocalStrategy({
		usernameField: "email"
	}, (email, password, done) => {
		//Match User
		User.findOne({email: email})
			.then(user =>{
			if(!user){
				return done(null, false, {message: "You're yet to create an account"});
			}
			
			//Match the password
			bcrypt.compare(password, user.password, (err, isMatch) => {
				if(err) throw err;
				if(isMatch){
					return done(null, user)
				} else{
					return done(null, false, {message: "Email or Password is Incorrect"})
				}
			});
		}).catch(err => console.log(err));
	})
	);
	
	passport.serializeUser(function(user, done){
		done(null, user._id);
	});
	
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		})
	})
}