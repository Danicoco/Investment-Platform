const Trade = require('../models/Trade');
const Invest = require('../models/Invest');
const Withdrawal = require('../models/Withdrawal');
const Referral = require('../models/Referral');
const moment = require('moment');

module.exports.placeInvest = async(req, res) => {
    const {id} = req.params;
    try{
        const trade = await Trade.findOne({_id:id});    
        res.render('invest/placement', {
            title: trade.title,
            currentUser: req.user,
            trade
        });
    } catch(e){
        req.flash('error', "We're unable to find the trade you're looking for");
        return res.redirect('/account/investment');
    }
}

module.exports.acceptInvest = async(req, res) => {
    const {amount, days, percent, plan} = req.body;
    const {id} = req.params;
    try{
        const trade = await Trade.findOne({_id:id});
        const invest = await Invest.find({'mowners.id': req.user._id});
        if(invest.length === 4){
            const image = req.file.path;
            const originalName = req.file.originalname;
            const fileName = req.file.filename;
            const size = req.file.size;
            const perch = 25 / 100;
            const guaranteeReturn = parseInt(amount) * perch; 
            const newInvest = await new Invest({amount, image, originalName, fileName, size, plan, percent, days, guaranteeReturn});
            newInvest.mowners.id = req.user._id;
            newInvest.mowners.email = req.user.email;
            newInvest.mowners.referralLink = req.user.referralLink;
            newInvest.mowners.name = req.user.name;
            newInvest.save();
            req.flash('success', 'Investment recieved. Kindly wait for the Admin to confirm');
            return res.redirect('/invest/investment-history');
        }
        const image = req.file.path;
        const originalName = req.file.originalname;
        const fileName = req.file.filename;
        const size = req.file.size;
        const perch = parseInt(percent) / 100;
        const guaranteeReturn = parseInt(amount) * perch; 
        const newInvest = await new Invest({amount, image, originalName, fileName, size, plan, percent, days, guaranteeReturn});
        newInvest.mowners.id = req.user._id;
        newInvest.mowners.email = req.user.email;
        newInvest.mowners.referralLink = req.user.referralLink;
        newInvest.mowners.name = req.user.name;
        newInvest.save();
        req.flash('success', 'Investment recieved. Kindly wait for the Admin to confirm');
        return res.redirect('/invest/investment-history');

    } catch(e){
        req.flash('error', 'Please enter a valid amount');
        return res.redirect('/invest/penny/' +id);
    }
}

module.exports.history = async(req, res) => {
    try{
        const invest = await Invest.find({'mowners.id': req.user._id});
        res.render('invest/history', {
            title: "Your investment history",
            currentUser: req.user,
            invest,
            moment
        });
    } catch(e){
        req.flash('error', 'Your history is not available');
        return res.redirect('/account/dashboard');
    }
}

module.exports.withdraw = async(req, res) =>{
    const withdrawal = await Withdrawal.find({'mowners.id': req.user._id});
    const referral = await Referral.find({'mowners.id': req.user._id});
    res.render('invest/withdraw', {
        title: "Your withdrawal history",
        currentUser: req.user,
        withdrawal,
        referral,
        moment
    });
}