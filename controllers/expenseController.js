const Expense = require("../models/expense.model");
const User = require("../models/user.model");

const mongoose = require("mongoose");

var ObjectId = mongoose.Types.ObjectId;


// This function will save/ update/ calculate user information of
// ** Usage: POST user expense related action

// `1. current_month_category_expense
//	** For CATEGORY: return a json, with all category + price
//	2. current_month_entity_expense
//	** For ENTITY: return a list of json, where each json represent a list of entity + price
//  3. current_month_total_expense
//  4. current_month_total_income
//  5. current_month_balance

const calculateUserIncomeExpense = async (req, res) => {
	try {
		const wanted_month = req.body.month;
		// console.log(month_name)
		const user = await User.findById(req.params.id);
		const expense_list = user.expense_list; // a list of expense id
		const all_categories_expense = [];

		// INCOME
		let income = 0;

		// Total expense (sum of all category expense)
		let total_expense = 0;

		// Category expense (sum of category's entities' expense)
		let all_category_expense = {
			'shop': 0,
			'food': 0,
			'housing': 0,
			'education': 0,
			'transport': 0,
			'entertainment': 0,
			'gift_donation': 0,
			'healthcare': 0, 
			'investment': 0,
			'other': 0
		}

		//Category's corresponding entity expense (add expense to entity each time)
		let all_category_entity_expense = {
			'shop':{
				'clothing': 0,
				'accessory': 0,
				'cosmetic': 0,
				'electronic_device': 0,
				'kitchenware': 0,
				'daily_necessity': 0,
				'pet_supply': 0,
				'baby_product': 0,

			},
			'food':{
				'meal': 0,
				'snack': 0,
				'fresh_produce': 0,
				'grocery': 0,
				'drink': 0
			},
			'housing':{
				'home_applicance': 0,
				'furniture': 0,
				'housing_payment': 0,
				'car_maintenance': 0,
				'utility': 0,
			},
			'education':{
				'education_general': 0,
				'stationery': 0,
			},
			'transport': {
				'transport': 0,
			},
			'entertainment': {
				'entertainment': 0,
			},
			'gift_donation': {
				'gift_donation': 0,
			},
			'healthcare': {
				'healthcare': 0,
			},
			'investment': {
				'investment': 0,
			},
			'other': {
				'other': 0,
			},	
		}

		const all_categories = Object.keys(all_category_entity_expense)

		if (expense_list.length != 0){
			for (let i = 0; i < expense_list.length; i++) {
				const expense_object = await Expense.findById(expense_list[i]);
				const expense = expense_object.expense
				const expense_month = expense_object.month

				// Only get the month wnat to be displayed 
				if(expense_month === wanted_month){
					// Calculating total INCOME
					if(expense_object.type == 'income'){
						income += expense
					}
					
					// Add to entity expense
					else if (expense_object.type == 'spending'){
						// All category names
						const all_categories = Object.keys(all_category_entity_expense)
						all_categories.forEach(function (category, i) {
							if(expense_object.category == category){
								// All entity names within that category
								const all_entities = Object.keys(all_category_entity_expense[category])
								all_entities.forEach(function(entity, j){
									if(expense_object.entity == entity){
										all_category_entity_expense[category][entity] += expense // add expense of that entity
										all_entities.push(all_category_entity_expense[category])
									}
								})
							}
						});
					}
				}
			}
		}

		// Calculate each category total expense (sum of all entities)
		all_categories.forEach(function (category, i) {
			all_category_expense[category] = sum(all_category_entity_expense[category])
		});

		// Calculate total expense
		total_expense = sum(all_category_expense)

		user.current_month_category_expense = all_category_expense;
		user.current_month_entity_expense = all_category_entity_expense;
		user.current_month_total_expense = total_expense;
		user.current_month_total_income = income;
		user.current_month_balance = income - total_expense;
			
		user.save().then(() => res.json(
			`user expenses summary updated for ${wanted_month}`
			));
	
	} catch (err) {
		console.log(err);
		res.status(400);
		return res.send("Database query failed");
	}
}

// To find the sum of json object value
function sum( obj ) {
	var sum = 0;
	for( var el in obj ) {
	  if( obj.hasOwnProperty( el ) ) {
		sum += parseFloat( obj[el] );
	  }
	}
	return sum;
  }



// POST: add new EXPENSE to USER:  inside User collection expense list
//	** if it is income, the category attribute will be income
// 	** FE usage: tracker page

const addNewExpense = async (req, res) => {

	// const month = ["January","February","March","April","May",
	// 			"June","July","August","September","October","November","December"];
	// const d = new Date();
	// let month_name = month[d.getMonth()];

	const type = req.body.type;
	const category = req.body.category;
	const entity = req.body.entity;
	const description = req.body.description;
	const expense = req.body.expense;
	// const current_month = month_name;

	const newExpense = new Expense({
		type,
		category,
		entity,
		description,
		expense,
		// current_month,
	});

	newExpense
		.save()
		.then(() => res.status(200).json(newExpense))
		.catch((err) => res.status(400).json(`Error ` + err));

	User.updateOne(
		{ _id: req.params.id },
		{ $push: { expense_list: newExpense._id } },
		{ new: true },
		(err, doc) => {
			if (err) {
				console.log(`Error` + err);
			}
		}
	);
};



// POST: calculate the Expense + Income + Balance amount and update user
const calculateMonthlyExpenseIncomeBalance = async (req, res) => {
	try{
		const user = await User.findById(req.params.id);
		const expense_list = user.expense_list; // a list of expense id

		let monthly_expense = await getMonthValues(expense_list, 'spending')
		let monthly_income = await getMonthValues(expense_list, 'income')

		let monthly_balance = {
			'Jan': monthly_income.Jan - monthly_expense.Jan,
			'Feb': monthly_income.Feb - monthly_expense.Feb,
			'Mar': monthly_income.Mar - monthly_expense.Mar,
			'Apr': monthly_income.Apr - monthly_expense.Apr,
			'May': monthly_income.May - monthly_expense.May,
			'June': monthly_income.June - monthly_expense.June,
			'July': monthly_income.July - monthly_expense.July,
			'Aug': monthly_income.Aug - monthly_expense.Aug,
			'Sep': monthly_income.Sep - monthly_expense.Sep,
			'Oct': monthly_income.Oct - monthly_expense.Oct,
			'Nov': monthly_income.Nov - monthly_expense.Nov,
			'Dec': monthly_income.Dec - monthly_expense.Dec
		}

		user.monthly_expense = monthly_expense;
		user.monthly_income = monthly_income;
		user.monthly_balance = monthly_balance;
		user.save().then(() => res.json("user monthly expenses summary updated"));

	}catch (err) {
		console.log(err);
		res.status(400);
		return res.send("Database query failed");
	}
}

const getMonthValues = async (lst, match_type) => {
	
	const monthly_value = {
		'Jan': 0,
		'Feb': 0,
		'Mar': 0,
		'Apr': 0,
		'May': 0,
		'June': 0,
		'July': 0,
		'Aug': 0,
		'Sep': 0,
		'Oct': 0,
		'Nov': 0,
		'Dec': 0
	}

	if (lst.length != 0) {
		for (let i = 0; i < lst.length; i++) {
			const expense_object = await Expense.findById(lst[i]);
			const type = expense_object.type;
			const expense = expense_object.expense;
			const month = expense_object.month;
			if (match_type == type){
				if (month == 'January'){
					monthly_value.Jan += expense;
				}
				if (month == 'February'){
					monthly_value.Feb += expense;
				}
				if (month == 'March'){
					monthly_value.Mar += expense;
				}
				if (month == 'April'){
					monthly_value.Apr += expense;
				}
				if (month == 'May'){
					monthly_value.May += expense;
				}
				if (month == 'June'){
					monthly_value.June += expense;
				}
				if (month == 'July'){
					monthly_value.July += expense;
				}
				if (month == 'August'){
					monthly_value.Aug += expense;
				}
				if (month == 'September'){
					monthly_value.Sep += expense;
				}
				if (month == 'October'){
					monthly_value.Oct += expense;
				}
				if (month == 'November'){
					monthly_value.Nov += expense;
				}
				if (month == 'December'){
					monthly_value.Dec += expense;
				}
			}
		}
	}
	return monthly_value;
}


module.exports = {
	calculateUserIncomeExpense,
	addNewExpense,
	calculateMonthlyExpenseIncomeBalance
};