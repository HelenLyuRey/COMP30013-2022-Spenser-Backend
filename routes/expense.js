const router = require("express").Router();

const {
    calculateUserCategoryEntityTotalExpense,
    addNewExpense,
}
 = require("../controllers/expenseController");


router.post("/calculateUserCategoryEntityTotalExpense/:id", calculateUserCategoryEntityTotalExpense); 
router.post("/addExpense/:id", addNewExpense) // user id, will need t change the link later
// figure out how to add while user speaks 


module.exports = router;