const Food = require("../models/food.model");
const User = require("../models/user.model");

const mongoose = require("mongoose");

var ObjectId = mongoose.Types.ObjectId;

// This function will get the total price for each entity
const updateUserFoodEntityTotalExpense = async (req, res) => {
    try {

		const user = await User.findById(req.params.id);
		const food = user.food; // a list of food id
		let snack_expense = 0
		let meal_expense = 0
		let drink_expense = 0
		let grocery_expense = 0
		let fresh_produce_expense = 0

		for (let i = 0; i < food.length; i++) {
			const food_object = await Food.findById(food[i]);

			if (food_object.entity == "snack"){
				snack_expense = snack_expense + food_object.expense; 
			}

			if (food_object.entity == "meal"){
				meal_expense = meal_expense + food_object.expense; 
			}

			if (food_object.entity == "drink"){
				drink_expense = drink_expense + food_object.expense; 
			}

			if (food_object.entity == "grocery shopping"){
				grocery_expense = grocery_expense + food_object.expense; 
			}

			if (food_object.entity == "fresh produce"){
				fresh_produce_expense = fresh_produce_expense + food_object.expense; 
			}
		}
			
		const food_entity_expense = 
		{
			"snack_expense": snack_expense,
			"meal_expense": meal_expense,
			"drink_expense": drink_expense,
			"grocery_expense": grocery_expense,
			"fresh_produce_expense": fresh_produce_expense,
		};

		user.entity_expense = food_entity_expense;
		user.save().then(() => res.json("user total entity expense updated"));
	
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
};


// This function will get the total price for the entire collection
const updateUserFoodCollectionExpense = async (req, res) => {
    try {

		const user = await User.findById(req.params.id);
		const food_ids = user.food;

		let food_collection_total_expense = 0;

		for (let i = 0; i < food_ids.length; i++) {
			const food_object = await Food.findById(food_ids[i]);
			food_collection_total_expense = food_collection_total_expense + food_object.expense;
		}
		// console.log(food_collection_total_expense)
		const user_food_total_expense = {
			"Food_expense": food_collection_total_expense,
		}

		user.collection_expense = user_food_total_expense;
		user.save().then(() => res.json("user food total expense updated"));

		return user_food_total_expense
	
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
};

// Add new FOOD to USER:  inside User collection food list
const addNewFood = async (req, res) => {

	const entity = req.body.entity;
	const description = req.body.description;
	const expense = req.body.expense;

	const newFood = new Food({
		entity,
		description,
		expense,
	});

	newFood
		.save()
		.then(() => res.status(200).json(newFood))
		.catch((err) => res.status(400).json(`Error ` + err));

	User.updateOne(
		{ _id: req.params.id },
		{ $push: { food: newFood._id } },
		{ new: true },
		(err, doc) => {
			if (err) {
				console.log(`Error` + err);
			}
		}
	);
};

module.exports = {
	updateUserFoodEntityTotalExpense,
	updateUserFoodCollectionExpense,
	addNewFood,
};