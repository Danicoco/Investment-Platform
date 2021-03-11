const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
	name: {
		type: String,
		required: true
    },
    email: {
		type: String,
		required: true,
		unique: true,
		trim: true
    },
    phone: {
        type: String,
        required: true
    },
	password: {
		type: String,
		required: true
	},
	referralLink: {
		type: String,
		required: true
	},
	referralCount: {
		type: Number,
		default: 0,
		trim: true
	},
	referralView: {
		type: Number,
		default: 0,
		trim: true
	}
});

UserSchema.set('timestamps', true)

const User = mongoose.model('User', UserSchema);

module.exports = User;