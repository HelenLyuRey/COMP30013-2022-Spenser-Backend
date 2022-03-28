const router = require("express").Router();

const {
    findEntityTotalExpense,
    findCollectionExpense,
}
 = require("../controllers/foodController");


router.get("/entityExpense", findEntityTotalExpense); 
router.get("/totalExpense", findCollectionExpense); 


module.exports = router;