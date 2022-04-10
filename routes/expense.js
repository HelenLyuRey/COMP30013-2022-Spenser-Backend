const router = require("express").Router();

const {
    calculateUserIncomeExpense,
	addNewExpense,
	getCurrentMonth,
	getMonthlyExpenseIncomeBalance
}
 = require("../controllers/expenseController");


router.post("/calculateUserIncomeExpense/:id", calculateUserIncomeExpense); 
router.post("/addExpense/:id", addNewExpense) // user id, will need t change the link later
// figure out how to add while user speaks 

// Only for testing purpose
router.get("/month", getCurrentMonth)
router.get("/getMonthlyExpenseIncomeBalance/:id", getMonthlyExpenseIncomeBalance)


module.exports = router;