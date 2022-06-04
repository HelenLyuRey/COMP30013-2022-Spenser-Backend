const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const userSchema = new Schema({
	email: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true},
	name: { type: String, required: true},
	agent_voice: { type: String, required: false, default: "Jenny - Neutral female agent"}, // string for now, can be changed later 
    expense_list: {
		type: [mongoose.Schema.ObjectId],
		ref: "Expense",
		required: false,
		default: [],
	},
	current_month_category_expense:  {type: Object, required: false},
	current_month_entity_expense: {type: Object, required: false}, // array of objects
	current_month_description_expense : {type: Object, required: false},
	current_month_total_expense: {type: Number, required: false, default: 0},
	current_month_total_income: {type: Number, required: false, default: 0},
	current_month_balance: {type: Number, required: false, default: 0},
	monthly_expense: {type: Object, required: false},
	monthly_income: {type: Object, required: false},
	monthly_balance: {type: Object, required: false},
	month: { type: String, required: false},
	year:{type: String, required: false}
});

const User = mongoose.model("User", userSchema, "user");

module.exports = User;