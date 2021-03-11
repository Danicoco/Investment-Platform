const User = require('../models/User');
const Invest = require('../models/Invest');
const Trade = require('../models/Trade');
const Referral = require('../models/Referral');
const Withdrawal = require('../models/Withdrawal');
const axios = require('axios');

module.exports.dashboard = async(req, res) => {
    const user = await User.find({});
    res.render('account/dashboard', {
        title: "All Users",
        user
    });
}

module.exports.allInvestment = async(req, res) => {
    const invest = await Invest.find({});
    res.render('account/allinvestment', {
        title: "All Investments",
        invest
    });
}

module.exports.referralWithdrawal = async(req, res) => {
    const referral = await Referral.find({});
    res.render('account/referral', {
        title: 'All Referral Withdraw Request',
        referral
    });
}

module.exports.confirmReferral = async(req, res) => {
    const {id} = req.body;
    try{
        const referral = await Referral.findOne({_id:id});
        const user = await User.findOne({_id:referral.mowners.id});
        const newBalance = parseInt(user.referralBonus) - parseInt(referral.amount);
        const updatedUser = await User.updateOne({_id:referral.mowners.id}, {referralBonus:newBalance}, {new:true});
        const newStatus = 'confirmed';
        const updated = await Referral.updateOne({_id:referral.id}, {status:newStatus}, {new:true});
        await axios.get('https://api.telegram.org/bot1521298873:AAH1wA4L9FaTJ-G6Insjgnpl_HIVyGbLuB0/sendMessage?chat_id=-1001423457747&text=Congratulations%20'+ referral.mowners.name + ',%0A%0AYour%20Referral%20Withdrawal%20as%20been%20confirmed%20and%20deposited%20into%20your%20bank%20account');
        req.flash('success', 'Referral Withdrawal Confirmed');
        return res.redirect('/account/referral-withdrawal')
    } catch (e){
        req.flash('error', 'Unable to confirm Withdrawal');
        return res.redirect('/account/referral-withdrawal');
    }
}
 
module.exports.declineReferral = async(req, res) => {
    const {id} = req.body;
    try{
        const referral = await Referral.findOne({_id:id});
        const newStatus = 'declined';
        const updated = await Referral.updateOne({_id:referral.id}, {status:newStatus}, {new:true});
        req.flash('success', 'Referral Withdrawal Declined');
        return res.redirect('/account/referral-withdrawal')
    } catch (e){
        req.flash('error', 'Unable to decline Withdrawal');
        return res.redirect('/account/referral-withdrawal');
    }
}

module.exports.allWithdrawal = async(req, res) => {
    const withdrawal = await Withdrawal.find({});
    res.render('account/withdrawal', {
        title: "All Withdrawal Request",
        withdrawal
    });
}

module.exports.confirmWithdraw = async(req, res) => {
    const {id} = req.body;
    try{
        const withdraw = await Withdrawal.findOne({_id:id});
        const user = await User.findOne({_id:withdraw.mowners.id});
        const newBalance = parseInt(user.avaliableMoney) - parseInt(withdraw.amount);
        const updatedUser = await User.updateOne({_id:withdraw.mowners.id}, {avaliableMoney:newBalance}, {new:true});
        const newStatus = 'confirmed';
        const updated = await Withdrawal.updateOne({_id:withdraw.id}, {status:newStatus}, {new:true});
        await axios.get('https://api.telegram.org/bot1521298873:AAH1wA4L9FaTJ-G6Insjgnpl_HIVyGbLuB0/sendMessage?chat_id=-1001423457747&text=Congratulations%20'+ withdraw.mowners.name + ',%0A%0AYour%20Withdrawal%20as%20been%20confirmed%20and%20deposited%20into%20your%20bank%20account');
        req.flash('success', 'Withdrawal Confirmed');
        return res.redirect('/account/all-withdrawals')
    } catch (e){
        req.flash('error', 'Unable to confirm Withdrawal');
        return res.redirect('/account/all-withdrawals');
    }
}
 
module.exports.declineWithdraw = async(req, res) => {
    const {id} = req.body;
    try{
        const withdraw = await Withdrawal.findOne({_id:id});
        const newStatus = 'declined';
        const updated = await Withdrawal.updateOne({_id:withdraw.id}, {status:newStatus}, {new:true});
        req.flash('success', 'Withdrawal Declined');
        return res.redirect('/account/all-withdrawals');
    } catch (e){
        req.flash('error', 'Unable to decline Withdrawal');
        return res.redirect('/account/all-withdrawals');
    }
}

module.exports.showTrade = async(req, res) => {
    const trade = await Trade.find({});
    res.render('account/trade', {
        title: "All PennyMartz Trade",
        trade
    });
}

module.exports.newTrade = async(req, res) => {
    res.render('account/newtrade', {
        title: "Create New Trade",
        currentUser: req.user
    });
}

module.exports.postNewTrade = async(req, res) => {
    const {title, description, minimum, maximum, numberOfDays, tradePercent, bitcoinWallet} = req.body;
    const checker = [title, description, minimum, maximum, numberOfDays, tradePercent];
    
    if(checker.includes('') || checker.includes(' ')){
        req.flash('error', 'Please fill all fileds');
        return res.redirect('/account/new-trade');
    }
    var regex = /^[0-9]+$/;
    if(!minimum.match(regex)){
        req.flash("error", "Please enter a valid minimum amount");
        return res.redirect('/account/new-trade');
    }
    if(!maximum.match(regex)){
        req.flash("error", "Please enter a valid maximum amount");
        return res.redirect('/account/new-trade');
    }
    if(!numberOfDays.match(regex)){
        req.flash("error", "Please enter a valid number of Days");
        return res.redirect('/account/new-trade');
    }
    if(!tradePercent.match(regex)){
        req.flash("error", "Trade Percent can only be numbers");
        return res.redirect('/account/new-trade');
    }

    const newTrade = await new Trade({title, description, minimum, maximum, numberOfDays, tradePercent, bitcoinWallet});
    newTrade.save();
    req.flash('success', 'Trade successfully created');
    return res.redirect('/account/trade');
}

module.exports.activateTrade = async(req, res) => {
    const {id} = req.body;
    try{
        const trade = await Trade.findOne({_id:id});
        const newStatus = 'Activated';
        const updated = await Trade.updateOne({_id:trade.id}, {status:newStatus}, {new:true});
        req.flash('success', 'Trade is Activated and Running');
        return res.redirect('/account/trade');
    } catch (e){
        req.flash('error', 'Unable to activate trade');
        return res.redirect('/account/trade');
    }
}

module.exports.pauseTrade = async(req, res) => {
    const {id} = req.body;
    try{
        const trade = await Trade.findOne({_id:id});
        const newStatus = 'Paused';
        const updated = await Trade.updateOne({_id:trade.id}, {status:newStatus}, {new:true});
        req.flash('success', 'Trade is Paused');
        return res.redirect('/account/trade');
    } catch (e){
        req.flash('error', 'Unable to pause trade');
        return res.redirect('/account/trade');
    }
}

module.exports.deleteTrade = async(req, res) => {
    const {id} = req.body;
    try{
        const trade = await Trade.findOne({_id:id});
        const deleted = await Trade.deleteOne({_id:trade.id});
        req.flash('success', 'Trade has been deleted');
        return res.redirect('/account/trade');
    } catch (e){
        req.flash('error', 'Unable to delete trade');
        return res.redirect('/account/trade');
    }
}

module.exports.confirmInvest = async(req, res) => {
    const {id} = req.body;
    try{
        const invest = await Invest.findOne({_id:id});
        const newStatus = 'confirmed';
        const updated = await Invest.updateOne({_id:invest.id}, {status:newStatus}, {new:true});
        await axios.get('https://api.telegram.org/bot1521298873:AAH1wA4L9FaTJ-G6Insjgnpl_HIVyGbLuB0/sendMessage?chat_id=-1001423457747&text=Congratulations%20'+ invest.mowners.name + ',%0A%0AYour%20Investment%20of%20'+invest.amount+'%20as%20been%20confirmed');
        req.flash('success', 'Investement Confirmed');
        return res.redirect('/account/all-investment');
    } catch (e){
        req.flash('error', 'Unable to activate trade');
        return res.redirect('/account/all-investment');
    }
}

module.exports.declineInvest = async(req, res) => {
    const {id} = req.body;
    try{
        const invest = await Invest.findOne({_id:id});
        const newStatus = 'declined';
        const updated = await Invest.updateOne({_id:invest.id}, {status:newStatus}, {new:true});
        req.flash('success', 'Investement Declined');
        return res.redirect('/account/all-investment');
    } catch (e){
        req.flash('error', 'Unable to activate trade');
        return res.redirect('/account/all-investment');
    }
}

module.exports.deleteInvest = async(req, res) => {
    const {id} = req.body;
    try{
        const invest = await Invest.findOne({_id:id});
        const deleted = await Invest.deleteOne({_id:invest.id});
        req.flash('success', 'Investmenet has been deleted');
        return res.redirect('/account/all-investment');
    } catch (e){
        req.flash('error', 'Unable to delete investment');
        return res.redirect('/account/all-investment');
    }
}