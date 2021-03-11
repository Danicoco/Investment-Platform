module.exports.authenticate = async(req, res, next) => {
    if(req.isAuthenticated()){
        return next();    
    }
    req.flash('error', "Please login to your account");
    return res.redirect('/login');
}