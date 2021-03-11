const validator = require("email-validator");
const Trade = require('../../models/Trade');

module.exports.regText = async(req, res, next) => {
    const {name, email, phone, password, password2} = req.body;
    const checker =  [name, email, phone, password, password2];
    try{
        if(checker.includes("") || checker.includes(" ")){
            req.flash('error', 'Please fill all fields');
            return res.redirect('/register');
        }
        if(phone.length !== 11){
            req.flash("error", "Invalid Phone Number");
            return res.redirect('/register');
        }
        var regex = /^[0-9]+$/;
        if(!phone.match(regex)){
            req.flash("error", "Please enter a valid phone number");
            return res.redirect('/register');
        }
        if(validator.validate(email) === false){
            req.flash("error", "Please enter a valid Email Address");
            return res.redirect('/register')
        }
        if(password.length < 8){
            req.flash('error', 'Paswword must be more than 8 characters');
            return res.redirect('/register');
        }
        if(password !== password2){
            req.flash("error", "Password must match");
            return res.redirect("/register");
        }
        return next();
    } catch(e){
        req.flash('error', 'There is a problem validating your input. Try again');
        return res.redirect('/register');
    }
}