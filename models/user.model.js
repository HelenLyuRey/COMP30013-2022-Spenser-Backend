const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const userSchema = new Schema({
	email: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true},
	name: { type: String, required: true},
	agent_voice: { type: String, required: false}, // string for now, can be changed later 
	agent_personality: { type: String, required: false},
    expense_list: {
		type: [mongoose.Schema.ObjectId],
		ref: "Expense",
		required: false,
		default: [],
	},
	current_month_collection_expense: {type: Number, required: false},
	current_month_entity_expense: {type: Number, required: false},
	current_month_total_expense: {type: Number, required: false},
	current_month_total_income: {type: Number, required: false},
	current_month_balance: {type: Number, required: false},
});

const User = mongoose.model("User", userSchema, "user");

module.exports = User;