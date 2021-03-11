const validator = require("email-validator");

module.exports.regText = async(req, res, next) => {
    const {email, password, password2} = req.body;
    const checker =  [email, password, password2];
    try{
        if(checker.includes("") || checker.includes(" ")){
            req.flash('error', 'Please fill all fields');
            return res.redirect('/add-admin');
        }
        if(validator.validate(email) === false){
            req.flash("error", "Please enter a valid Email Address");
            return res.redirect('/add-admin')
        }
        if(password.length < 8){
            req.flash('error', 'Paswword must be more than 8 characters');
            return res.redirect('/add-admin');
        }
        if(password !== password2){
            req.flash("error", "Password must match");
            return res.redirect("/add-admin");
        }
        return next();
    } catch(e){
        req.flash('error', 'There is a problem validating your input. Try again');
        return res.redirect('/add-admin');
    }
}