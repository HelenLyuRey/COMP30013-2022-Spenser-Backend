const router = require("express").Router();

const {
    updateUserEntityTotalExpense,
    updateUserCategoryExpense,
    addNewExpense,
}
 = require("../controllers/expenseController");


router.post("/updateUserExpenseEntityTotalExpense/:id", updateUserEntityTotalExpense); 
router.post("/updateUserExpenseCollectionExpense/:id", updateUserCategoryExpense); 
router.post("/addExpense/:id", addNewExpense) // user id, will need t change the link later
// figure out how to add while user speaks 


module.exports = router;