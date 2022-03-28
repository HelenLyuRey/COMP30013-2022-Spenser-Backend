const router = require("express").Router();

const { signup, login, logout } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.patch("/logout", logout);

module.exports = router;
