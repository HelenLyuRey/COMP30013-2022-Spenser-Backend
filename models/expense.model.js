const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    type: { type: String, required: true},
    category: { type: String, required: false},
	entity: { type: String, required: false},
    description: { type: String, required: false },
    expense: { type: Number, required: true },
	month: { type: String, required: true},
});

const Expense = mongoose.model("Expense", expenseSchema, "expense");

module.exports = Expense;