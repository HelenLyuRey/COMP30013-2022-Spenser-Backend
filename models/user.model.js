const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const userSchema = new Schema({
	email: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true},
	name: { type: String, required: true},
    food: {
		type: [mongoose.Schema.ObjectId],
		ref: "Food",
		required: false,
		default: [],
	},
});

const User = mongoose.model("User", userSchema, "user");

module.exports = User;