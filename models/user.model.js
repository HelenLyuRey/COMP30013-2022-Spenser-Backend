const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { Food } = require("../models/food.model");

const userSchema = new Schema({
	username: { type: String, required: true},
	password: { type: String, required: true},
    food: {
		type: [mongoose.Schema.ObjectId],
		ref: Food,
		required: false,
		default: [],
	}
});

const User = mongoose.model("User", userSchema);

module.exports = User;