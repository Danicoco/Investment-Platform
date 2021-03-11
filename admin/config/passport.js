const LocalStrategy = require("passport-local").Strategy,
	  mongoose = require("mongoose"),
	  bcrypt = require("bcryptjs"),
	  Admin = require("../models/Admin");

//Export Strategy
module.exports = function(passport){
	passport.use('local',
	new LocalStrategy({
		usernameField: "email"
	}, (email, password, done) => {
		//Match Admin
		Admin.findOne({email: email})
			.then(admin =>{
			if(!admin){
				return done(null, false, {message: "Invalid login credentials"});
			}
			
			//Match the password
			bcrypt.compare(password, admin.password, (err, isMatch) => {
				if(err) throw err;
				if(isMatch){
					return done(null, admin)
				} else{
					return done(null, false, {message: "Email or Password is Incorrect"})
				}
			});
		}).catch(err => console.log(err));
	})
	);
	
	passport.serializeUser(function(admin, done){
		done(null, admin._id);
	});
	
	passport.deserializeUser(function(id, done){
		Admin.findById(id, function(err, admin){
			done(err, admin);
		})
	})
}