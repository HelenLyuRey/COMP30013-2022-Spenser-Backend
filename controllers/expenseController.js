const Expense = require("../models/expense.model");
const User = require("../models/user.model");

const mongoose = require("mongoose");

var ObjectId = mongoose.Types.ObjectId;

// This function will get the total price for each entity
const updateUserEntityTotalExpense = async (req, res) => {
    try {

		const user = await User.findById(req.params.id);
		const expense = user.expense; // a list of expense id
		let snack_expense = 0
		let meal_expense = 0
		let drink_expense = 0
		let grocery_expense = 0
		let fresh_produce_expense = 0

		for (let i = 0; i < expense.length; i++) {
			const expense_object = await Expense.findById(expense[i]);

			if (expense_object.entity == "snack"){
				snack_expense = snack_expense + expense_object.expense; 
			}

			if (expense_object.entity == "meal"){
				meal_expense = meal_expense + expense_object.expense; 
			}

			if (expense_object.entity == "drink"){
				drink_expense = drink_expense + expense_object.expense; 
			}

			if (expense_object.entity == "grocery shopping"){
				grocery_expense = grocery_expense + expense_object.expense; 
			}

			if (expense_object.entity == "fresh produce"){
				fresh_produce_expense = fresh_produce_expense + expense_object.expense; 
			}
		}
			
		const expense_entity_expense = 
		{
			"snack_expense": snack_expense,
			"meal_expense": meal_expense,
			"drink_expense": drink_expense,
			"grocery_expense": grocery_expense,
			"fresh_produce_expense": fresh_produce_expense,
		};

		user.entity_expense = expense_entity_expense;
		user.save().then(() => res.json("user total entity expense updated"));
	
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
};


// This function will get the total price for the entire collection
const updateUserCategoryExpense = async (req, res) => {
    try {

		const user = await User.findById(req.params.id);
		const expense_ids = user.expense;

		let expense_collection_total_expense = 0;

		for (let i = 0; i < expense_ids.length; i++) {
			const expense_object = await Expense.findById(expense_ids[i]);
			expense_collection_total_expense = expense_collection_total_expense + expense_object.expense;
		}
		// console.log(expense_collection_total_expense)
		const user_expense_total_expense = {
			"Expense_expense": expense_collection_total_expense,
		}

		user.collection_expense = user_expense_total_expense;
		user.save().then(() => res.json("user expense total expense updated"));

		return user_expense_total_expense
	
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
};

// Add new EXPENSE to USER:  inside User collection expense list
const addNewExpense = async (req, res) => {

	const entity = req.body.entity;
	const description = req.body.description;
	const expense = req.body.expense;

	const newExpense = new Expense({
		collection,
		entity,
		description,
		expense,
	});

	newExpense
		.save()
		.then(() => res.status(200).json(newExpense))
		.catch((err) => res.status(400).json(`Error ` + err));

	User.updateOne(
		{ _id: req.params.id },
		{ $push: { expense: newExpense._id } },
		{ new: true },
		(err, doc) => {
			if (err) {
				console.log(`Error` + err);
			}
		}
	);
};

module.exports = {
	updateUserEntityTotalExpense,
	updateUserCategoryExpense,
	addNewExpense,
};