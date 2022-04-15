const router = require("express").Router();

const {
    calculateUserIncomeExpense,
	addNewExpense,
	calculateMonthlyExpenseIncomeBalance
}
 = require("../controllers/expenseController");


router.post("/calculateUserIncomeExpense/:id", calculateUserIncomeExpense); 
router.post("/addExpense/:id", addNewExpense) // user id, will need t change the link later
// figure out how to add while user speaks 

// Only for testing purpose
router.post("/calculateMonthlyExpenseIncomeBalance/:id", calculateMonthlyExpenseIncomeBalance)


module.exports = router;