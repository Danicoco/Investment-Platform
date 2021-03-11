const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TradeSchema = new Schema({
	title: {
		type: String,
		required: true
    },
    minimum: {
		type: String,
		required: true,
    },
    maximum: {
        type: String,
        required: true
    },
    numberOfDays: {
        type: String,
        required: true
    },
    tradePercent: {
        type: String,
        required: true
    },
	description: {
		type: String,
		required: true
    },
    status: {
        type: String,
        default: 'Activated'
    },
    bitcoinWallet: {
        type: String,
        required: true
    }
});

TradeSchema.set('timestamps', true)

const Trade = mongoose.model('Trade', TradeSchema);

module.exports = Trade;