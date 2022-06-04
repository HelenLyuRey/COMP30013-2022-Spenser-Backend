const Expense = require("../models/expense.model");
const User = require("../models/user.model");

const mongoose = require("mongoose");

var ObjectId = mongoose.Types.ObjectId;


// This function will save/ update/ calculate user information of
// ** Usage: POST user expense related action
// ** Parameter in: month - string, year - string

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
		const wanted_year = req.body.year;
		// console.log(wanted_month, 'BE')
		const user = await User.findById(req.params.id);
		const expense_list = user.expense_list; // a list of expense id
		const all_categories_expense = [];

		// console.log()

		// Category + entity + description expense --> json inside json inside json
		let description_json = {}
		
		const entity_keys = []
		const description_keys = []

		let count = 0

		if (expense_list.length != 0){
			for (let i = 0; i < expense_list.length; i++) {
				
				const expense_object = await Expense.findById(expense_list[i]);

				const category = expense_object.category
				const entity = expense_object.entity
				const description = expense_object.description
				const expense = expense_object.expense
				const expense_month = expense_object.month
				const expense_year = expense_object.year

				if(expense_month.toLowerCase() === wanted_month.toLowerCase()
					&& expense_year === wanted_year
					){
					console.log(expense_list[i])
					count += 1

					const category_keys = Object.keys(description_json)
					if (!category_keys.includes(category)){
						description_json[category] = {}
					}
					const entity_keys = Object.keys(description_json[category])
					if (!entity_keys.includes(entity)){
						description_json[category][entity] = {}
					}

					if(description === ""){
						if (description_json[category][entity]['general'] === undefined){
							description_json[category][entity]['general'] = expense
						}
						else{
							description_json[category][entity]['general'] += expense
						}
						}
						else{
						if (description_json[category][entity][description] === undefined){
							description_json[category][entity][description] = expense
						}
						else{
							description_json[category][entity][description] += expense
						}
					}
				}
			}
		}

		// If this month has value
		if (count !== 0){
			// Category + entity expense --> json inside json
			let entity_json = JSON.parse(JSON.stringify(description_json))
			for (var cat_key in entity_json) {
				for(var ent_key in entity_json[cat_key]){
					entity_json[cat_key][ent_key] = sum(entity_json[cat_key][ent_key])
				}
			}

			// Calculate each category total expense (sum of all entities)
			const all_categories = Object.keys(entity_json)
			let category_json = JSON.parse(JSON.stringify(entity_json))
			all_categories.forEach(function (category, i) {
				category_json[category] = sum(category_json[category])
			});

			//Calculate total expense
			
			if(category_json.income === undefined){ 
				//Only have expense, no income
				total_expense = sum(category_json)
				income = 0
			}else{ 
				// Have both income and expense + only have income
				total_expense = sum(category_json) - category_json.income 
				income = category_json.income 
			}
			console.log(total_expense, "expense")
			console.log(income, "income")

			user.current_month_category_expense = category_json;
			user.current_month_entity_expense = entity_json;
			user.current_month_description_expense = description_json;
			user.current_month_total_expense = total_expense;
			user.current_month_total_income = income;
			user.current_month_balance = income - total_expense;
			user.month = wanted_month;
			user.year = wanted_year;
				
			user.save().then(() => res.json(
				`user expenses summary updated for  ${wanted_year} ${wanted_month}`
				));
		}
		else{
			user.current_month_category_expense = {};
			user.current_month_entity_expense = {};
			user.current_month_description_expense = {};
			user.current_month_total_expense = 0;
			user.current_month_total_income = 0;
			user.current_month_balance = 0;
			user.month = wanted_month;
			user.year = wanted_year;
			user.save().then(() => res.json(
				`user expenses summary updated for ${wanted_year} ${wanted_month}`
				));
		}

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

	const type = req.body.type;
	let category = req.body.category;
	let entity = req.body.entity;
	const description = req.body.description;
	const expense = req.body.expense;

	if (type === 'income'){
		category = 'income'
		entity = 'income'
	}
	
	const month = req.body.month;
	const year = req.body.year;

	const newExpense = new Expense({
		type,
		category,
		entity,
		description,
		expense,
		month,
		year,
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



// ** POST: calculate the Expense + Income + Balance amount and update user
// ** Parameter in: year - string
const calculateMonthlyExpenseIncomeBalance = async (req, res) => {
	try{
		const user = await User.findById(req.params.id);
		const expense_list = user.expense_list; // a list of expense id
		const wanted_year = req.body.year;

		let monthly_expense = await getMonthValues(expense_list, 'spending', wanted_year
		)
		let monthly_income = await getMonthValues(expense_list, 'income', wanted_year
		)

		// console.log(monthly_income)

		let monthly_balance = {
			'Jan': monthly_income.Jan - monthly_expense.Jan,
			'Feb': monthly_income.Feb - monthly_expense.Feb,
			'Mar': monthly_income.Mar - monthly_expense.Mar,
			'Apr': monthly_income.Apr - monthly_expense.Apr,
			'May': monthly_income.May - monthly_expense.May,
			'Jun': monthly_income.Jun - monthly_expense.Jun,
			'Jul': monthly_income.Jul - monthly_expense.Jul,
			'Aug': monthly_income.Aug - monthly_expense.Aug,
			'Sep': monthly_income.Sep - monthly_expense.Sep,
			'Oct': monthly_income.Oct - monthly_expense.Oct,
			'Nov': monthly_income.Nov - monthly_expense.Nov,
			'Dec': monthly_income.Dec - monthly_expense.Dec
		}

		user.monthly_expense = monthly_expense;
		user.monthly_income = monthly_income;
		user.monthly_balance = monthly_balance;
		user.save().then(() => res.json(`user monthly expenses summary updated for ${wanted_year}`));

	}catch (err) {
		console.log(err);
		res.status(400);
		return res.send("Database query failed");
	}
}

const getMonthValues = async (lst, match_type, wanted_year) => {
	
	let monthly_value = {
		'Jan': 0,
		'Feb': 0,
		'Mar': 0,
		'Apr': 0,
		'May': 0,
		'Jun': 0,
		'Jul': 0,
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
			const year = expense_object.year;
			if (match_type === type && wanted_year === year){
				const month_name = Object.keys(monthly_value)
				month_name.forEach((eachmonth)=>{
					if(eachmonth == month){
						monthly_value[month] += expense
					}
				})
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