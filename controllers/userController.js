
// userTotalSpending --
// now we only have food collection and foodTotal is calculated in food controller
// but later we would have more collections such as transport/ shops ect
// the total expense will need to add them as well


const User = require("../models/user.model");

const updateUserTotalExpense = async (req, res) => {
    try {
        let total_expense = 0;
		const user = await User.findById(req.params.id);	

		const food_expense = user.collection_expense.Food_expense
		// gonna add more here for stage 2: like shop expense/ transport expense

        if(user.collection_expense.Food_expense != undefined){
			total_expense = total_expense + food_expense;
		}

		user.total_spending = total_expense;
		user.save().then(() => res.json("user total spending updated"));
		// console.log(user.collection_expense.drinkexpense);
        
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
}

module.exports = {
	updateUserTotalExpense,
};