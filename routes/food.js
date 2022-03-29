const router = require("express").Router();

const {
    updateUserFoodEntityTotalExpense,
    updateUserFoodCollectionExpense,
    addNewFood,
}
 = require("../controllers/foodController");


router.post("/updateUserFoodEntityTotalExpense/:id", updateUserFoodEntityTotalExpense); 
router.post("/updateUserFoodCollectionExpense/:id", updateUserFoodCollectionExpense); 
router.post("/addFood/:id", addNewFood) // user id, will need t change the link later
// figure out how to add while user speaks 


module.exports = router;