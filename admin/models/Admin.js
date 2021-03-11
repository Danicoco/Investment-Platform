const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    email: {
		type: String,
		required: true,
		unique: true,
		trim: true
    },
	password: {
		type: String,
		required: true
	}
});

AdminSchema.set('timestamps', true)

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;