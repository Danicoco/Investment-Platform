const User = require('../models/User');
const Referrer = require('../models/Referrer');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const crypto = require('crypto');

module.exports.home = (req, res) => {
    res.render('home', {
        title: "PennyMartz"
    });
}

module.exports.loginShow = (req, res) => {
    res.render('signup/login', {
        title: "Login Page"
    });
}

module.exports.registerShow = async(req, res) => {
    try{
        res.render('signup/reg', {
            title: "Register"
        });
    } catch(e){
        req.query('error', 'Referrer does not exist. Please use the normal register link below');
        return res.redirect('/login');
    }
}

module.exports.postReg = async(req, res) => {
    const {name, email, phone, password} = req.body;
    const referralLink = crypto.randomBytes(5).toString('hex');
    try {
        const newUser = await new User ({name, email, phone, referralLink, password});

        //Hash password
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, async(err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            //Save the user
        await newUser.save();
        }));
        req.flash('success', 'Successfully Registered. Proceed to Login');
        return res.redirect('/login');
    } catch(e){
        req.flash('error', "We're unable to register your account. Please try again later");
        return res.redirect('/register');
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

module.exports.refShow = async(req, res) => {
    const {ref} = req.params;
    try{
        if(ref){
            const referrer = await User.findOne({referralLink: ref});
            const newCount = (parseInt(referrer.referralView) + parseInt(1));
            const added = await User.updateOne({_id:referrer._id}, {referralView:newCount}, {new:true});
        }
        res.render('signup/regref', {
            title: "Register",
            ref
        });
    } catch(e){
        req.query('error', 'Referrer does not exist. Please use the normal register link below');
        return res.redirect('/login');
    }
}

module.exports.refPost = async(req, res) => {
    const {name, email, phone, password} = req.body;
    const {ref} = req.params;
    const referralLink = crypto.randomBytes(5).toString('hex');
    try {
        const newUser = await new User ({name, email, phone, referralLink, password});

        //Hash password
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, async(err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            //Save the user
        await newUser.save();
        }));
        const referr = await User.findOne({referralLink: ref});
        const newCount = (parseInt(referr.referralCount) + parseInt(1));
        const added = await User.updateOne({_id:referr._id}, {referralCount:newCount}, {new:true});

        const userName =newUser.name;
        const userId = newUser.id;
        const userEmail = newUser.email;
        const newReferrer = await new Referrer({userId, userName, userEmail});
        newReferrer.mowners.id = referr._id;
        newReferrer.mowners.email = referr.email;
        newReferrer.mowners.referralLink = referr.referralLink;
        newReferrer.mowners.name = referr.name;
        newReferrer.save();
        req.flash('success', 'Successfully Registered. Proceed to Login');
        return res.redirect('/login');
    } catch(e){
        req.flash('error', "We're unable to register your account. Please try again later");
        return res.redirect('/register');
    }
        
}
