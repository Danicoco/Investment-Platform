const moment = require('moment');
const Trade = require('../models/Trade');
const Withdrawal = require('../models/Withdrawal');
const Referral = require('../models/Referral');
const User = require('../models/User');
const Bank = require('../models/Bank');
const Invest = require('../models/Invest');
const Referrer = require('../models/Referrer');

module.exports.dashboard = async(req, res) => {
    const bank = await Bank.findOne({'mowners.id': req.user._id});
    const invest = await Invest.find({'mowners.id': req.user._id});
    res.render('account/dashboard', {
        title: "Dashboard",
        currentUser: req.user,
        moment,
        bank,
        invest
    });
}

module.exports.investment = async(req, res) => {
    const trade = await Trade.find({});
    res.render('account/investment', {
        title: "Invest Now",
        currentUser: req.user,
        trade
    });
}

module.exports.trade = async(req, res) => {
    res.render('account/trade', {
        title: "Create Trade",
        currentUser: req.user
    });
}

module.exports.newTrade = async(req, res) => {
    const {title, minimum, maximum, description} = req.body;

    const newTrade = await new Trade({title, minimum, maximum, description});
    newTrade.save();
    return res.redirect('/account/new-trade');
}

module.exports.withdraw = async(req, res) => {
    const {amount, testimony} = req.body;

    if(req.user.avaliableMoney === 0){
        req.flash('error', "Your balance is very low");
        return res.redirect('/account/dashboard');
    }
    if(amount > req.user.avaliableMoney){
        req.flash('error', "Your balance is low");
        return res.redirect('/account/dashboard');
    }
    if(testimony === '' || testimony === ' '){
        req.flash('error', 'You must leave a testimony to withdraw');
        return res.redirect('/account/dashboard');
    }
    console.log("first " +amount);
    const newCount = (parseInt(req.user.avaliableMoney) - parseInt(amount));
    User.updateOne({_id:req.user._id}, {avaliableMoney:newCount}, { new: true }, (err, nc) =>{
        if(err) throw err;
    });

    const newWithdrawal = new Withdrawal({amount, testimony});
    newWithdrawal.mowners.id = req.user._id;
    newWithdrawal.mowners.email = req.user.email;
    newWithdrawal.mowners.referralLink = req.user.referralLink;
    newWithdrawal.mowners.name = req.user.name;
    newWithdrawal.save();
    req.flash('success', "We've recieved request. Kindly wait for the Admin to verify your withdrawl");
    return res.redirect('/invest/withdraw-history');
}

module.exports.referral = async(req, res) => {
    const {amount, testimony} = req.body;

    if(req.user.referralBonus === 0){
        req.flash('error', "Your balance is very low");
        return res.redirect('/account/dashboard');
    }
    if(amount > req.user.referralBonus){
        req.flash('error', "Your balance is low");
        return res.redirect('/account/dashboard');
    }
    if(testimony === '' || testimony === ' '){
        req.flash('error', 'You must leave a testimony to withdraw');
        return res.redirect('/account/dashboard');
    }

    const newCount = (parseInt(req.user.referralBonus) - parseInt(amount));
    User.updateOne({_id:req.user._id}, {referralBonus:newCount}, { new: true }, (err, nc) =>{
        if(err) throw err;
    });

    const newWithdraw = new Referral({amount, testimony});
    newWithdraw.mowners.id = req.user._id;
    newWithdraw.mowners.email = req.user.email;
    newWithdraw.mowners.referralLink = req.user.referralLink;
    newWithdraw.mowners.name = req.user.name;
    newWithdraw.save();
    req.flash('success', "We've recieved request. Kindly wait for the Admin to verify your withdrawl");
    return res.redirect('/invest/withdraw-history');
}

module.exports.profile = async(req, res) => {
    const host = req.headers.host;
    res.render('account/profile', {
        title: "My Profile",
        currentUser: req.user,
        host
    });
}

module.exports.updateProfile = async(req, res) => {
    const {name, email, phone} = req.body;
    const query = {name, email, phone};
    const user = await User.updateOne({_id:req.user._id}, query, {new:true});
    req.flash('success', 'Profile Successfully Updated');
    return res.redirect('/account/profile');
}

module.exports.bank = async(req, res) => {
    const bank = await Bank.findOne({'mowners.id': req.user._id});
    const host = req.headers.host;
    res.render('account/bank', {
        title: "My Bank Account",
        currentUser: req.user,
        host,
        bank
    });
}

module.exports.createBank = async(req, res) => {
    const {bankName, accountName, accountNumber} = req.body;
    if(bankName === "" || accountName === "" || accountNumber === ""){
        req.flash('error', "Please fill in your bank details");
        return res.redirect('/account/bank');
    }
    const newBank = await new Bank({bankName, accountName, accountNumber});
    newBank.mowners.id = req.user._id;
    newBank.mowners.email = req.user.email;
    newBank.mowners.referralLink = req.user.referralLink;
    newBank.mowners.name = req.user.name;
    newBank.save();
    req.flash('success', 'Successfully Added your Bank Details');
    return res.redirect('/account/bank');
}

module.exports.updateBank = async(req, res) => {
    const host = req.headers.host;
    const bank = await Bank.findOne({'mowners.id': req.user._id});
    res.render("account/getbank", {
        title: "My Bank Account",
        currentUser: req.user,
        bank,
        host
    });
}

module.exports.updatedBank = async(req, res) => {
    const {bankName, accountNumber, accountName} = req.body;
    const query = {bankName, accountName, accountNumber};

    const bank = await Bank.findOne({'mowners.id': req.user._id});
    const update = await Bank.updateOne({_id:bank.id}, query, {new:true});
    req.flash('success', "Bank Details successfully updated");
    return res.redirect('/account/bank');
}

module.exports.logout = async(req, res) => {
    req.session.destroy();
    req.logout();
    return res.redirect('/login');
}

module.exports.referrals = async(req, res) => {
    const referrer = await Referrer.find({'mowners.id': req.user.id});
    const host = req.headers.host;
    res.render('account/referral', {
        title: "My Referrals",
        currentUser: req.user,
        referrer,
        moment,
        host
    });
}