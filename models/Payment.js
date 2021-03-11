const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
	avaliableMoney: {
        type: Number,
        default: 0
    },
    totalWithdrawal: {
        type: Number,
        default: 0
    },
    referralBonus: {
        type: Number,
        default: 0
    },
    mowners:{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		email: String,
        referralLink: String,
        name: String
	}
});

PaymentSchema.set('timestamps', true)

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;