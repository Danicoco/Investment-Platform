const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BankSchema = new Schema({
	accountName: {
        type: String
    },
    accountNumber: {
        type: Number
    },
    bankName: {
        type: String
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

BankSchema.set('timestamps', true)

const Bank = mongoose.model('Bank', BankSchema);

module.exports = Bank;