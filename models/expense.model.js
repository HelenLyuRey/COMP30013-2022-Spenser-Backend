const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const month = ["Jan","Feb","Mar","Apr","May",
				"Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const d = new Date();
let month_name = month[d.getMonth()];
var year = d.getFullYear() 

const expenseSchema = new Schema({
    type: { type: String, required: true},
    category: { type: String, required: false},
	entity: { type: String, required: false},
    description: { type: String, required: false },
    expense: { type: Number, required: true },
    year: { type: String, required: false, default: year},
	month: { type: String, required: false, default: month_name},
});

const Expense = mongoose.model("Expense", expenseSchema, "expense");

module.exports = Expense;