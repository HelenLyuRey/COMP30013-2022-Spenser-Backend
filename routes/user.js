const router = require("express").Router();

const {
    getUser,
    updateUserProfile
}= require("../controllers/userController");

router.get("/profile/:id", getUser);
router.post("/updateProfile/:id ", updateUserProfile); 

module.exports = router;