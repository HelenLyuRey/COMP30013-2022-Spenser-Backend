const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const foodSchema = new Schema({
	entity: { type: String, required: true},
    description: { type: String, required: true },
    expense: { type: Number, required: true },
	// date: { type: Date, required: true, default: Date.now },
});

const Food = mongoose.model("Food", foodSchema, "food");

module.exports = Food;