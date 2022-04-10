const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    category: { type: String, required: true},
	entity: { type: String, required: true},
    description: { type: String, required: false },
    expense: { type: Number, required: true },
	date: { type: Date, required: true},
});

const Expense = mongoose.model("Expense", expenseSchema, "expense");

module.exports = Expense;