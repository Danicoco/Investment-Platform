const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReferralSchema = new Schema({
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

ReferralSchema.set('timestamps', true)

const Referral = mongoose.model('Referral', ReferralSchema);

module.exports = Referral;