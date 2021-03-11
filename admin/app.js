if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT;

//Ejs Templating engine
app.engine('ejs', ejsMate);

//using ejs as frontend template --
app.set('view engine', 'ejs');

//Use static files
app.use('/static', express.static('public'));

//Allow parsing of form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Passport local authentication
require("./config/passport")(passport);

//Database connection
db = require("./config/keys").MongoURI;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
	.then(() => {console.log("MongoDB connected")})
	.catch(err => console.log(err));

//Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  //store,
  secret: process.env.SSECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
	  expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
	  maxAge: 1000 * 60 * 60 * 24 * 1
 	 }
}));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

//Passport middleware initialization
app.use(passport.initialize());
app.use(passport.session());

//Integrating flash middleware
app.use(flash());

//Global Variables
app.use(function(req, res, next){
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});


//routes
app.use('/', require('./routes/index'));
app.use('/account', require('./routes/account'));

//app listen on port
app.listen(PORT, (req, res) => {
    console.log(`Server started at ${PORT}`);
});