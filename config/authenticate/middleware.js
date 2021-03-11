const Payment = require('../../models/Payment');

module.exports.createPay = async(req, res, next) => {
    const payment = await Payment.findOne({'mowners.id':req.user._id});
    if(payment){
        console.log("From already exist " +payment)
        return next();
    } 
    if(payment === null){
        console.log("From did not exist " +payment)
        const avaliableMoney = 0;
        const totalWithdrawal = 0;
        const referralBonus = 0;
        const newPay = await new Payment({avaliableMoney, totalWithdrawal, referralBonus});
        newPay.mowners.id = req.user._id;
        newPay.mowners.email = req.user.email;
        newPay.mowners.referralLink = req.user.referralLink;
        newPay.mowners.name = req.user.name;
        newPay.save();
        return next();
    }
}