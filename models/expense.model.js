const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const month = ["January","February","March","April","May",
				"June","July","August","September","October","November","December"];
const d = new Date();
let month_name = month[d.getMonth()];

const expenseSchema = new Schema({
    type: { type: String, required: true},
    category: { type: String, required: false},
	entity: { type: String, required: false},
    description: { type: String, required: false },
    expense: { type: Number, required: true },
	month: { type: String, required: false, default: month_name},
});

const Expense = mongoose.model("Expense", expenseSchema, "expense");

module.exports = Expense;