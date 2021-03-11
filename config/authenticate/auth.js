const Invest = require('../../models/Invest');
const User = require('../../models/User');
const Referrer = require('../../models/Referrer');
const moment = require('moment');

module.exports.authenticate = async(req, res, next) => {
    if(req.isAuthenticated()){
        return next();    
    }
    req.flash('error', "Please login to your account");
    return res.redirect('/login');
}

module.exports.investYiel = async(req, res, next) => {
    const invest = await Invest.find({'mowners.id': req.user._id});
    for(i=0; i < invest.length; i++){
        const dateyield = moment(invest[i].updatedAt).add(7, 'd').format('MMMM Do YYYY, h:mm:ss');
        console.log(dateyield);
        if(invest[i].status === 'confirmed' && dateyield >= moment().format('MMMM Do YYYY, h:mm:ss')){
            const newStatus = 'completed';
            const updated = await Invest.updateOne({_id:invest[i].id}, {status:newStatus}, {new:true});
            const newBalance = parseInt(req.user.avaliableMoney) + parseInt(invest[i].guaranteeReturn);
            const updatedBalance = await User.updateOne({_id:req.user._id}, {avaliableMoney:newBalance}, {new:true});
        }
    }
    return next();
}

module.exports.bonus = async(req, res, next) => {
    const referrer = await Referrer.find({'mowners.id': req.user._id});
    for(i=0; i < referrer.length; i++){
        const invest = await Invest.find({'mowners.id': referrer[i].userId});
        for(h=0; h < invest.length; h++){
            if(invest[i].status === 'completed'){
                var x = 2 / 100;
                var rtx = parseInt(invest[i].amount) * parseInt(x);
                const newBonus = parseInt(req.user.referralBonus) + parseInt(rtx);
                const updated = await User.updateOne({_id:req.user._id}, {referralBonus:newBonus}, {new:true});
            }
        }
    }
    return next();
}