const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReferrerSchema = new Schema({
    userId: {
        type: String,
        trim: true
    },
	userName: {
        type: String,
        trim: true
    },
    userEmail: {
        type: String,
        trim: true
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

ReferrerSchema.set('timestamps', true)

const Referrer = mongoose.model('Referrer', ReferrerSchema);

module.exports = Referrer;