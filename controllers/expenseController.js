const Expense = require("../models/expense.model");
const User = require("../models/user.model");

const mongoose = require("mongoose");

var ObjectId = mongoose.Types.ObjectId;


// This function will get the total price for each ENTITY + all CATEGORY 
//	** For ENTITY: return a list of json, where each json represent a list of entity + price
//  ** FE usage: dropdown table
// 	** BE usage: GET getAllEntityExpenses

//	** For CATEGORY: return a json, with all category + price
//  ** FE usage: pie chart
// 	** BE usage: GET getAllCategoryExpenses


// This is a dump way of writting it, can change into a dictionary later when have time
const calculateUserCategoryEntityTotalExpense = async (req, res) => {
    try {

		const user = await User.findById(req.params.id);
		const expense = user.expense; // a list of expense id
		const all_entities = []

		// FOOD category
		let food_category_total_expense = 0
		let snack_expense = 0
		let meal_expense = 0
		let drink_expense = 0
		let grocery_expense = 0
		let fresh_produce_expense = 0

		// SHOP category
		let shop_category_total_expense = 0
		let clothes_expense = 0
		let accessories_expense = 0
		let cosmetics_expense = 0

		for (let i = 0; i < expense.length; i++) {
			const expense_object = await Expense.findById(expense[i]);
			const expense = expense_object.expense

			if(expense_object.category == 'food' ){
				if (expense_object.entity == "snack"){
					snack_expense += expense; 
				}
				if (expense_object.entity == "meal"){
					meal_expense += expense; 
				}
				if (expense_object.entity == "drink"){
					drink_expense += expense; 
				}
				if (expense_object.entity == "grocery shopping"){
					grocery_expense += expense; 
				}
				if (expense_object.entity == "fresh produce"){
					fresh_produce_expense += expense; 
				}
				food_category_total_expense += expense;
			}

			if(expense_object.category == 'shop' ){
				if (expense_object.entity == "clothes"){
					clothes_expense = clothes_expense + expense; 
				}
				if (expense_object.entity == "accessories"){
					accessories_expense = accessories_expense + expense; 
				}
				if (expense_object.entity == "cosmetics"){
					cosmetics_expense = cosmetics_expense + expense; 
				}
				shop_category_total_expense += expense;
			}
		}
			
		// ENTITY expense
		const food_entity_expense = 
		{
			"snack_expense": snack_expense,
			"meal_expense": meal_expense,
			"drink_expense": drink_expense,
			"grocery_expense": grocery_expense,
			"fresh_produce_expense": fresh_produce_expense,
		};

		all_entities.push(food_entity_expense)
		const shop_entity_expense = 
		{
			"clothes_expense": clothes_expense,
			"accessories_expense": accessories_expense,
			"cosmetics_expense": cosmetics_expense,
		};
		all_entities.push(shop_entity_expense)


		// CATEGORY expense
		const category_expense = {
			"food_category_expense": food_category_total_expense,
			"shop_category_expense": shop_category_total_expense,
		}

		user.current_month_entity_expense = all_entities;
		user.current_month_category_expense = category_expense;
		user.save().then(() => res.json("user total entity expenses updated"));
	
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
};




// Add new EXPENSE to USER:  inside User collection expense list
// 	** FE usage: tracker page
// 	** BE usage: POST new expense

const addNewExpense = async (req, res) => {

	const month = ["January","February","March","April","May",
				"June","July","August","September","October","November","December"];
	const d = new Date();
	let month_name = month[d.getMonth()];

	const category = req.body.category;
	const entity = req.body.entity;
	const description = req.body.description;
	const expense = req.body.expense;
	const month = month_name;

	const newExpense = new Expense({
		collection,
		entity,
		description,
		expense,
		month,
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
	calculateUserCategoryEntityTotalExpense,
	addNewExpense,
};