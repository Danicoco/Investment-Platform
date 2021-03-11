const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvestSchema = new Schema({
	amount: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        required: true
    },
    days: {
        type: String
    },
    guaranteeReturn: {
        type: String
    },
    plan: {
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

InvestSchema.set('timestamps', true)

const Invest = mongoose.model('Invest', InvestSchema);

module.exports = Invest;