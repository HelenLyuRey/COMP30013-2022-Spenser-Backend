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


// This is a dump way of writting it, can change into a dictionary later when have time
const calculateUserIncomeExpense = async (req, res) => {
    try {

		const user = await User.findById(req.params.id);
		const expense_list = user.expense; // a list of expense id
		const all_entities = []

		// INCOME
		let income = 0

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

		if (expense_list.length != 0){
			for (let i = 0; i < expense_list.length; i++) {
				const expense_object = await Expense.findById(expense_list[i]);
				const expense = expense_object.expense

				// Calculating total INCOME
				if(expense_object.type == 'income'){
					income += expense
				}

				else if (expense_object.type == 'spending'){
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

		const total_expense = food_category_total_expense + shop_category_total_expense;

		user.current_month_category_expense = category_expense;
		user.current_month_entity_expense = all_entities;
		user.current_month_total_expense = total_expense;
		user.current_month_total_income = income;
		user.current_month_balance = total_expense - income;
		user.save().then(() => res.json("user total entity expenses updated"));
	
	} catch (err) {
		console.log(err);
		res.status(400);
		return res.send("Database query failed");
	}
};

// POST: add new EXPENSE to USER:  inside User collection expense list
//	** if it is income, the category attribute will be income
// 	** FE usage: tracker page

const addNewExpense = async (req, res) => {

	const month = ["January","February","March","April","May",
				"June","July","August","September","October","November","December"];
	const d = new Date();
	let month_name = month[d.getMonth()];

	const type = req.body.type;
	const category = req.body.category;
	const entity = req.body.entity;
	const description = req.body.description;
	const expense = req.body.expense;
	const month = month_name;

	const newExpense = new Expense({
		type,
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



// GET current month name
// ** FE usage: dashboard
const getCurrentMonth = (req, res) => {
	const month = ["January","February","March","April","May",
				"June","July","August","September","October","November","December"];
	const d = new Date();
	let month_name = month[d.getMonth()];

	return month_name
}


// GET the Expense + Income + Balance amount 
const getMonthlyExpenseIncomeBalance = async (req, res) => {
	try{
		const user = await User.findById(req.params.id);
		const expense_list = user.expense; // a list of expense id
		const expenseIncomeBalanceList = []

		const monthly_expense = getMonthValues(expense_list, 'income')
		const monthly_income = getMonthValues(expense_list, 'spending')
		const monthly_balance = {
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

		expenseIncomeBalanceList.push(monthly_expense);
		expenseIncomeBalanceList.push(monthly_income);
		expenseIncomeBalanceList.push(monthly_balance);

		return expenseIncomeBalanceList;

	}catch (err) {
		console.log(err);
		res.status(400);
		return res.send("Database query failed");
	}
}

function getMonthValues(lst, match_type) {
	
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
	getCurrentMonth,
	getMonthlyExpenseIncomeBalance
};