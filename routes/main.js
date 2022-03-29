const express = require("express");
const router = express.Router();

const food = require("../routes/food");
const user = require("../routes/user");
const auth = require("../routes/auth");

router.use("/food", food);
router.use("/user", user)
router.use("/auth", auth);

module.exports = router;
