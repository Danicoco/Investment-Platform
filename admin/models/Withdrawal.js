const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WithdrawalSchema = new Schema({
	amount: {
        type: Number,
        required: true
    },
    testimony: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        required: true
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

WithdrawalSchema.set('timestamps', true)

const Withdrawal = mongoose.model('Withdrawal', WithdrawalSchema);

module.exports = Withdrawal;