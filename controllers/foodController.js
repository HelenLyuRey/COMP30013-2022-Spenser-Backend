const Food = require("../models/food.model");

const mongoose = require("mongoose");

var ObjectId = mongoose.Types.ObjectId;

// This function will get the total price for each entity
const findEntityTotalExpense = async (req, res) => {
    try {
		const food = await Food.find().lean()
		let snack_expense = 0
		let meal_expense = 0
		let drink_expense = 0
		let grocery_expense = 0
		let fresh_produce_expense = 0

		for (let i = 0; i < food.length; i++) {
			if (food[i].entity == "snack"){
				snack_expense = snack_expense + food[i].expense; 
			}

			if (food[i].entity == "meal"){
				meal_expense = meal_expense + food[i].expense; 
			}

			if (food[i].entity == "drink"){
				drink_expense = drink_expense + food[i].expense; 
			}

			if (food[i].entity == "grocery shopping"){
				grocery_expense = grocery_expense + food[i].expense; 
			}

			if (food[i].entity == "fresh produce"){
				fresh_produce_expense = fresh_produce_expense + food[i].expense; 
			}
		}
			
		const entity_expense = 
		{
			"snack epense": snack_expense,
			"meal epense": meal_expense,
			"drink epense": drink_expense,
			"grocery epense": grocery_expense,
			"fresh produce expense": fresh_produce_expense,
		};

		return res.send(entity_expense)
	
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
};


// This function will get the total price for the entire collection
const findCollectionExpense = async (req, res) => {
    try {
		const food = await Food.find().lean()
		let total_expense = 0

		for (let i = 0; i < food.length; i++) {
			total_expense = total_expense + food[i].expense
		}

		return res.send({"collection expense": total_expense})
	
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
};

module.exports = {
	findEntityTotalExpense,
	findCollectionExpense,
};