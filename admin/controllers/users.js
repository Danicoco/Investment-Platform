const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const passport = require('passport');

module.exports.home = (req, res) => {
   return res.redirect('/login')
}

module.exports.loginShow = (req, res) => {
    res.render('signup/login', {
        title: "Login Page"
    });
}

module.exports.registerShow = (req, res) => {
    res.render('signup/reg', {
        title: "Register"
    });
}

module.exports.postReg = async(req, res) => {
    const {email, password} = req.body;
    try {
        const newAdmin = new Admin({email, password});

        //Hash password
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newAdmin.password, salt, async(err, hash) => {
            if(err) throw err;
            newAdmin.password = hash;
            //Save the admin
            newAdmin.save()
                .then(admin => {
                req.flash("success", "Successfully added new admin");
                return res.redirect("/add-admin");
            }).catch(err => console.log(err));
        }));
    } catch(e){
        req.flash('error', "We're unable to register your account. Please try again later");
        return res.redirect('/add-admin');
    }
}

module.exports.postLogin = async(req, res, next) =>{
        await passport.authenticate("local", {
            successRedirect: "/account/dashboard",
            failureRedirect: "/login",
            failureFlash: true,
            successFlash: true
        })(req, res, next);
}

module.exports.logout = async(req, res) => {
    req.session.destroy;
    req.logout;
    req.flash('success', 'Logged Out');
    return res.redirect('/login');
}