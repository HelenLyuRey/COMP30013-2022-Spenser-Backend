const router = require("express").Router();

const {
    updateUserTotalExpense,
}= require("../controllers/userController");

router.post("/updateUserTotalExpense/:id", updateUserTotalExpense); 

module.exports = router;