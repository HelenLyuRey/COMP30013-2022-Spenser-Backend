
// // userTotalSpending --
// // now we only have expense collection and expenseTotal is calculated in expense controller
// // but later we would have more collections such as transport/ shops ect
// // the total expense will need to add them as well


// const User = require("../models/user.model");

// // Current month total expense: 
// // 			loop thorugh all expenses and add them together
// const updateUserTotalExpense = async (req, res) => {
//     try {
//         let total_expense = 0;
// 		const user = await User.findById(req.params.id);	

// 		const expense_lst = user.expense_list
// 		const total_expense = 0;

//         if(user.collection_expense.Expense_expense != undefined){
// 			total_expense = total_expense + expense_expense;
// 		}

// 		user.total_spending = total_expense;
// 		user.save().then(() => res.json("user total expense updated"));
// 		// console.log(user.collection_expense.drinkexpense);
        
// 	} catch (err) {
// 		console.log(err)
// 		res.status(400)
// 		return res.send("Database query failed")
// 	}
// }

// module.exports = {
// 	updateUserTotalExpense,
// };