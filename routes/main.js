const express = require("express");
const router = express.Router();

const expense = require("../routes/expense");
const user = require("../routes/user");
const auth = require("../routes/auth");

router.use("/expense", expense);
router.use("/user", user)
router.use("/auth", auth);

module.exports = router;
